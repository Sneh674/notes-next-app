import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/helpers/jwt";

export async function GET(req: NextRequest) {
    try {
        // Extract token from Authorization header
        const authHeader = req.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ message: "Unauthorized - No Token" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1]; // Get the token part

        // Verify token
        const user = verifyToken(token);

        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.json({ user });
    }
    catch (error: unknown) {  // Use `unknown` for proper typing
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
    }
}