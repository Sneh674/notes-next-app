import {connect,disconnect} from "@/dbConfig/dbConfig";
import userModel from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { generateToken } from "@/helpers/jwt";
// import jwt from "jsonwebtoken";

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    await connect();
    // Parse request body
    const reqBody = await request.json();
    const { lemail, lpassword } = reqBody;

    // Check if user exists
    const user = await userModel.findOne({ email: lemail });
    console.log(user);
    if (!user) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 }
      );
    }

    // Check if password is correct
    const hashedPassword = hashPassword(lpassword);
    
    if (user.password!==hashedPassword) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 400 }
      );
    }

    const token=generateToken({id:user._id,email:user.email});

    console.log(token);

    // Create response
    const response = NextResponse.json({
      user:user,
      message: "Login successful",
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
// export default {loginUser as POST}; If arrow function used