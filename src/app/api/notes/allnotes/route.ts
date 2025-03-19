import { verifyToken } from "@/helpers/jwt";
import { NextRequest, NextResponse } from "next/server";
import NoteModel from "@/models/notesModel";
import { connect, disconnect } from "@/dbConfig/dbConfig";


export async function GET(req: NextRequest) {
    try {
        // return NextResponse.json({ message: "Hello" });
        await connect();
        console.log("Connected to database");

        // Extract token from Authorization header
        const authHeader = req.headers.get("Authorization");
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
        console.log(user);
        // return NextResponse.json({ user });

        try {
            const notes = await NoteModel.find({ email: user.email }).sort({ updatedAt: -1 });
            await disconnect();
            return NextResponse.json({ user: user.email, allNotes: notes });
        } catch (error) {
            return NextResponse.json({ message: "Error fetching notes", error }, { status: 500 });
        }
    }
    catch (error: unknown) {  // Use `unknown` for proper typing
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
    }
}