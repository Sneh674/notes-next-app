import NoteModel from "@/models/notesModel";
import { connect, disconnect } from "@/dbConfig/dbConfig";
import { verifyToken } from "@/helpers/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest, {params}: {params: {noteId: string}}) {
    try{
        await connect();
        const authHeader = request.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ message: "Unauthorized - No Token" }, { status: 401 });
        }
        const token = authHeader.split(" ")[1]; // Get the token part
        console.log("Extracted Token:", token);
        const user = verifyToken(token);
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const { noteId } = params; // Get noteId from URL params
        console.log("trial2");
        console.log({ noteId });
        const deletedNote = await NoteModel.findByIdAndDelete(noteId);
        console.log(deletedNote);
        await disconnect();
        return NextResponse.json({ message: "Note deleted successfully", deletedNote });
    }
    catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
    }
}