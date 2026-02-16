import { verifyToken } from "@/helpers/jwt";
import { NextRequest, NextResponse } from "next/server";
import NoteModel from "@/models/notesModel";
import { connect, disconnect } from "@/dbConfig/dbConfig";
import { pipeline, Pipeline, FeatureExtractionPipeline } from "@xenova/transformers";

let extractor: Pipeline | FeatureExtractionPipeline | null;

// Load model once (important)
async function getModel(): Promise<Pipeline | null | FeatureExtractionPipeline> {
    if (!extractor) {
        extractor = await pipeline(
            "feature-extraction",
            "Xenova/all-MiniLM-L6-v2"
        );
    }
    return extractor;
}

export async function POST(request: NextRequest) {
    try {
        await connect();
        // Extract token from Authorization header
        const authHeader = request.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ message: "Unauthorized - No Token" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1]; // Get the token part
        console.log("Extracted Token:", token);

        // Verify token
        const user = verifyToken(token);

        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        console.log("trial1");
        const reqBody = await request.json();
        const { username, title, content, useremail } = reqBody;

        const model = await getModel();
        if (!model) {
            return NextResponse.json({ message: "Couldn't get model for Vector to Embeddings" }, { status: 501 });
        }

        const text = `${title}\n${content}`;
        const output = await model(text, {
            pooling: "mean",
            normalize: true
        });
        const embedding = Array.from(output.data);

        console.log("trial2");
        console.log({ username, title, content, useremail, embedding });
        const createdNote = await NoteModel.create({
            name: username,
            title: title,
            content: content,
            email: useremail,
            embedding: embedding
        });
        console.log(createdNote);
        await disconnect();
        return NextResponse.json({ message: "Note added successfully", createdNote });
    } catch (error: unknown) {  // Use `unknown` for proper typing
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
    }
}