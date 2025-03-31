import { connect, disconnect } from "@/dbConfig/dbConfig";
import userModel from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
// import { generateToken } from "@/helpers/jwt";

function hashPassword(password: string): string {
    return crypto.createHash("sha256").update(password).digest("hex");
}

export async function POST(request: NextRequest) {
    try {
        await connect();
        // Parse request body
        const reqBody = await request.json();
        const { uemail, upassword } = reqBody;

        const user=await userModel.findOne({ email: uemail });
        if(!user){
            return NextResponse.json(
                { error: "User not found" },
                { status: 400 }
            );
        }
        const password = hashPassword(upassword);
        user.password = password;
        await user.save();
        // const token = generateToken({ id: user._id, email: user.email });

        // const token = generateToken({ id: createdUser._id, email: createdUser.email });

        // console.log(token);
        const response = NextResponse.json({
            user,
            message: "Password updation successful",
            // token: token,
        });

        await disconnect();
        return response;
    } catch (error: unknown) {
        if (error instanceof Error) {
            await disconnect();
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }
        await disconnect();
        return NextResponse.json(
            { error: "An unknown error occurred" },
            { status: 500 }
        );
    }
}