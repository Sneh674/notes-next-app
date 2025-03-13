import { connect, disconnect } from "@/dbConfig/dbConfig";
import userModel from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

function hashPassword(password: string): string {
    return crypto.createHash("sha256").update(password).digest("hex");
}

export async function POST(request: NextRequest) {
    try {
        await connect();
        // Parse request body
        const reqBody = await request.json();
        const { uname, uemail, upassword } = reqBody;

        // Check if user exists
        const user = await userModel.findOne({ email: uemail });
        if (user) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            );
        }

        const hashedPassword = hashPassword(upassword);

        //   const token=generateToken({id:user._id,email:user.email});

        //   console.log(token);

        // Create response
        const response = NextResponse.json({
            // user:user,
            message: "Registered successful",
            // token: token,
        });

        // await disconnect();
        return response;
    } catch (error: any) {
        await disconnect();
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}