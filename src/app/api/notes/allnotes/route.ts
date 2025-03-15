import { verifyToken } from "@/helpers/jwt";
import { NextRequest, NextResponse } from "next/server";
import NoteModel from "@/models/notesModel";
import { connect, disconnect } from "@/dbConfig/dbConfig";

// app.get('/notes',verifyToken ,async(req,res)=>{
//     const uname=req.username;
//     console.log(req.username)
//     // if (!req.session.username) {
//     //     // If session has expired, redirect to login page
//     //     return res.redirect('/');
//     // }
//     // let allNotes=await notesModel.find({name: req.session.username})
//     let allNotes=await notesModel.find({name: uname}).sort({ updatedAt: -1 })
//     // const user=req.flash("user")
//     // req.session.username=user
//     res.render('notes', {user: uname, allnotes: allNotes})
// })

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
            const notes = await NoteModel.find({ email: user.email });

            return NextResponse.json({ user: user.email, allNotes: notes });
        } catch (error) {
            return NextResponse.json({ message: "Error fetching notes" }, { status: 500 });
        }
    }
    catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}