import UserModel from "@/models/userModel";
import { connect, disconnect } from "@/dbConfig/dbConfig";
import { verifyToken } from "@/helpers/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        await connect();
        // Extract token from Authorization header
        const authHeader = req.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ message: "Unauthorized - No Token" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1]; // Get the token part
        console.log("Extracted Token:", token);
        const user = verifyToken(token);
        if(!user){
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const users = await UserModel.findOne({ _id:user.id});
        await disconnect();
        return NextResponse.json({ username: users.name, email: users.email });
    } catch (error: unknown) {  // Use `unknown` for proper typing
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
    }
}