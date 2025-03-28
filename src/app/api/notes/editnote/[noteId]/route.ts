import NoteModel from "@/models/notesModel";
import { connect, disconnect } from "@/dbConfig/dbConfig";
import { verifyToken } from "@/helpers/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, context: { params: { noteId: string } }) {
    try{
        await connect();

        const { noteId } = context.params;
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

        const reqBody = await request.json();
        if (!reqBody) {
            return NextResponse.json({ message: "Request body is required" }, { status: 400 });
        }
        const { title, content } = reqBody;
        try{
            const note=await NoteModel.findOneAndUpdate({ _id: noteId }, {$set:{title, content}}, { new: true });
            console.log("Note updated:", note);

            await disconnect();
            return NextResponse.json({ note }); 
        } catch(error: unknown) {
            if (error instanceof Error) {
                return NextResponse.json({ error: error.message }, { status: 500 });
            }
            return NextResponse.json({ error: "Couldn't update note in database" }, { status: 500 });
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
    }
}