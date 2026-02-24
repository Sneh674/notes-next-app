import { pipeline, FeatureExtractionPipeline } from "@xenova/transformers";
import { connect } from "@/dbConfig/dbConfig";
import NoteModel from "@/models/notesModel";
import { verifyToken } from "@/helpers/jwt";
import { NextRequest, NextResponse } from "next/server";
import { callHuggingFace } from "@/app/api/llmCall/route";

let extractor: FeatureExtractionPipeline | null = null;

const getModel = async (): Promise<FeatureExtractionPipeline> => {
    if (!extractor) {
        extractor = await pipeline(
            "feature-extraction",
            "Xenova/all-MiniLM-L6-v2"
        );
    }
    return extractor;
};


const cosineSimilarity = (a: number[], b: number[]) => {
    let dot = 0.0;
    let normA = 0.0;
    let normB = 0.0;

    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }

    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export const POST = async (req: NextRequest) => {
    try {
        await connect();
        const authHeader = req.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ message: "Unauthorized - No Token" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1]; // Get the token part
        console.log("Extracted Token:", token);
        const user = verifyToken(token);

        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { query, email } = await req.json();

        const model = await getModel();
        if (!model) {
            return NextResponse.json({ message: "Couldn't get model for Vector to Embeddings" }, { status: 501 });
        }
        // const queryEmbedding = await generateEmbedding(query);
        const output = await model(query, {
            pooling: "mean",
            normalize: true
        });
        const queryEmbedding = Array.from(output.data);
        console.log("user email from token:", email);

        const notes = await NoteModel.find({ email }, { title: 1, content: 1, embedding: 1 });
        console.log(queryEmbedding.length);
        console.log(notes.length);
        if (notes.length === 0) {
            return NextResponse.json({ answer: "No notes found for this user.", sources: [] });
        }
        console.log(notes[0].embedding.length);


        const scoredNotes = notes.map(note => ({
            note,
            score: cosineSimilarity(queryEmbedding, note.embedding)
        }));

        scoredNotes.sort((a, b) => b.score - a.score);
        console.log("Scored Notes:", scoredNotes.slice(0, 10).map(n => ({ id: n.note._id, score: n.score, title: n.note.title })));

        // return NextResponse.json(scoredNotes.slice(0, 3));
        const topNotes = scoredNotes.slice(0, 10);

        // Combine note content into context
        const context = topNotes
            .map((item, index) =>
                `Note ${index + 1}:\nTitle: ${item.note.title}\nContent: ${item.note.content}`
            )
            .join("\n\n");

        // Build prompt for LLM
        const prompt = `
        You are a helpful assistant.

        Sensitive personal data (passwords, credentials, IDs, numbers, emails, etc.)
        must ONLY be provided if the user explicitly and specifically asks for that exact item.

        If the user asks a vague or general question (e.g., "tell me about myself",
        "what do you know about me", etc.), do NOT include sensitive details.
        Instead, provide only general, non-sensitive descriptive information.

        Do not assume that a general question implies permission to reveal credentials.

        Use the context below to answer the user's question.
        If the answer is not in the context, say you don't know.

        Do not add unnecessary information as well special character like '**','*' etc. Be concise and to the point.

        Also, do not mention the source of the information in your answer, but keep in mind that the information is from the user's notes.
        Do not use any information that is not present in the context.
        Do not make it interactive.
        Do not say something like "Based on the provided notes, the answer is..."
        Do not ask for what else you could do or anything like that.

        Do give the user full, properly worded answer with all essential information from the context.

        Context:
        ${context}

        Question:
        ${query}
        `;

        const answer = await callHuggingFace(prompt);
        // console.log("LLM Raw Response:", answer);

        return NextResponse.json({
            answer,
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
};
