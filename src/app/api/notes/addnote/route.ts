import { verifyToken } from "@/helpers/jwt";
import { NextRequest, NextResponse } from "next/server";
import NoteModel from "@/models/notesModel";
import { connect, disconnect } from "@/dbConfig/dbConfig";

export async function POST(request: NextRequest) {
    try{
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
        const reqBody = await request.json();
        const { username, title, content, useremail } = reqBody;
        const createdNote = await NoteModel.create({
            name: username,
            title: title,
            content: content,
            email: useremail
        });
        console.log(createdNote);
        await disconnect();
    } catch (error: unknown) {  // Use `unknown` for proper typing
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
    }
}