import NoteModel from "@/models/notesModel";
import { connect, disconnect } from "@/dbConfig/dbConfig";
import { verifyToken } from "@/helpers/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest, { params }: { params: { noteId: string } }) {
    try {
        await connect();

        // Extract `noteId` from params
        const { noteId } = params;
        if (!noteId) {
            return NextResponse.json({ message: "Note ID is required" }, { status: 400 });
        }

        // Token verification
        const authHeader = request.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ message: "Unauthorized - No Token" }, { status: 401 });
        }
        const token = authHeader.split(" ")[1];
        console.log("Extracted Token:", token);
        const user = verifyToken(token);
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Delete the note
        console.log("Deleting note with ID:", noteId);
        const deletedNote = await NoteModel.findByIdAndDelete(noteId);
        if (!deletedNote) {
            return NextResponse.json({ message: "Note not found" }, { status: 404 });
        }

        await disconnect();
        return NextResponse.json({ message: "Note deleted successfully", deletedNote });

    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
    }
}
