import { pipeline, FeatureExtractionPipeline } from "@xenova/transformers";
import { connect } from "@/dbConfig/dbConfig";
import NoteModel from "@/models/notesModel";
import { verifyToken } from "@/helpers/jwt";
import { NextRequest, NextResponse } from "next/server";

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

        const notes = await NoteModel.find({ email });
        console.log(queryEmbedding.length);
        console.log(notes[0].embedding.length);


        const scoredNotes = notes.map(note => ({
            note,
            score: cosineSimilarity(queryEmbedding, note.embedding)
        }));

        scoredNotes.sort((a, b) => b.score - a.score);
        console.log("Scored Notes:", scoredNotes.slice(0, 3).map(n => ({ id: n.note._id, score: n.score, title: n.note.title })));

        return NextResponse.json(scoredNotes.slice(0, 3));

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
};
