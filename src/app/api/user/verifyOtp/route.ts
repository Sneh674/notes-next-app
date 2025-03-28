import { connect, disconnect } from "@/dbConfig/dbConfig";
import userModel from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    try{
        const {email, otp}=await request.json();
        await connect();
        const user = await userModel.findOne({ email: email });
        if (!user) {
            return NextResponse.json(
                { error: "User doesn't exist" },
                { status: 400 }
            );
        }
        console.log(user);
        console.log(user.otp);
        if(user.otp==otp && user.expiresAt>new Date()){
            user.otp="";
            user.expiresAt=null;
            user.verified=true;
            await user.save();
            await disconnect();
            return NextResponse.json(
                { message: "OTP verified", verifed: true },
                { status: 200 }
            );
        }
        else{
            await disconnect();
            return NextResponse.json(
                { error: "Invalid OTP" },
                { status: 400 }
            );
        }
    }catch (error: unknown) {
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