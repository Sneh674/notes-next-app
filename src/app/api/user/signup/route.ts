import { connect, disconnect } from "@/dbConfig/dbConfig";
import userModel from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { generateToken } from "@/helpers/jwt";

function hashPassword(password: string): string {
    return crypto.createHash("sha256").update(password).digest("hex");
}
// function generateOTP(): string {
//     return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
// }

export async function POST(request: NextRequest) {
    try {
        await connect();
        // Parse request body
        const reqBody = await request.json();
        const { uname, uemail, upassword } = reqBody;

        // Check if user exists
        // const user = await userModel.findOne({ email: uemail });
        // if (user) {
        //     return NextResponse.json(
        //         { error: "User already exists" },
        //         { status: 400 }
        //     );
        // }

        // const otp = generateOTP();
        // // await sendOTPEmail(uemail, otp);
        // const createdUser = await userModel.create({
        //     name: uname,
        //     email: uemail,
        //     password: hashPassword(upassword),
        //     otp,
        //     expiresAt: new Date(Date.now() + 10 * 60000)
        // });

        const user=await userModel.findOne({ email: uemail });
        if(!user){
            return NextResponse.json(
                { error: "User not found" },
                { status: 400 }
            );
        }
        const password = hashPassword(upassword);
        user.password = password;
        user.name = uname;
        user.verified = true;
        await user.save();
        const token = generateToken({ id: user._id, email: user.email });

        // const token = generateToken({ id: createdUser._id, email: createdUser.email });

        console.log(token);
        const response = NextResponse.json({
            user,
            message: "Registered successful",
            token: token,
        });

        // await disconnect();
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