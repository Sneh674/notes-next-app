import { connect, disconnect } from "@/dbConfig/dbConfig";
import userModel from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { generateToken } from "@/helpers/jwt";
import nodemailer from "nodemailer";

function hashPassword(password: string): string {
    return crypto.createHash("sha256").update(password).digest("hex");
}
function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
}

async function sendOTPEmail(email: string, otp: string) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MY_EMAIL,
            pass: process.env.MY_PASSWORD,
        },
    });

    await transporter.sendMail({
        from: process.env.MY_EMAIL,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is: ${otp}. It is valid for 10 minutes.`,
    });
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

        const otp = generateOTP();
        // await sendOTPEmail(uemail, otp);
        const createdUser = await userModel.create({
            name: uname,
            email: uemail,
            password: hashPassword(upassword),
            otp, 
            expiresAt: new Date(Date.now() + 10 * 60000)
        });
        // const token=generateToken({id:createdUser._id,email:createdUser.email});

        // Create response
        const response = NextResponse.json({
            user: createdUser,
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