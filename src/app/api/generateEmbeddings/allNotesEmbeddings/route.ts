// import { verifyToken } from "@/helpers/jwt";
import { NextResponse } from "next/server";
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

export async function POST() {
    try {
        await connect();

        const model = await getModel();

        if (!model) {
            return NextResponse.json({ message: "Couldn't get model for Vector to Embeddings" }, { status: 501 });
        }

        // Get notes without embeddings
        const notes = await NoteModel.find({
            $or: [
                { embedding: { $exists: false } },
                { embedding: { $size: 0 } }
            ]
        });

        console.log(`Found ${notes.length} notes`);

        for (const note of notes) {
            const text = `${note.title}\n${note.content}`;

            const output = await model(text, {
                pooling: "mean",
                normalize: true
            });

            const embedding = Array.from(output.data);

            await NoteModel.updateOne(
                { _id: note._id },
                { $set: { embedding } }
            );

        }

        await disconnect();
        return NextResponse.json({
            message: "Embeddings generated successfully"
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}
