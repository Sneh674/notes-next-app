import { connect, disconnect } from "@/dbConfig/dbConfig";
import userModel from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

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
        const { uemail, forgotPassword } = await request.json();
        await connect();
        console.log(uemail);
        const user = await userModel.findOne({ email: uemail });
        if (user && user.verified && (forgotPassword==false)) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            );
        }
        const otp = generateOTP();
        try {
            await sendOTPEmail(uemail, otp);
        } catch (error: unknown) {
            if (error instanceof Error) {
                return NextResponse.json(
                    { error: error.message },
                    { status: 500 }
                );
            }
            return NextResponse.json(
                { error: "Error occurred while sending the mail" },
                { status: 500 }
            );
        }
        console.log(otp);
        if(user){
            user.otp = otp;
            user.expiresAt = new Date(Date.now() + 10 * 60000);
            await user.save();
            await disconnect();
            return NextResponse.json({ message: "OTP sent" });
        }
        const response = await userModel.create({
            email: uemail,
            otp,
            expiresAt: new Date(Date.now() + 10 * 60000),
            name: "temporary user data",
            password: "12345678",
            verified: false,
        });
        await disconnect();
        return NextResponse.json({ response });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }
        return NextResponse.json(
            { error: "An unknown error occurred" },
            { status: 500 }
        );
    }
}