import {connect,disconnect} from "@/dbConfig/dbConfig";
import userModel from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
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

    // Create token data
    // const tokenData = {
    //   id: user._id,
    //   name: user.name,
    //   email: user.email
    // };

    // Create token
    // const token = jwt.sign(tokenData, process.env.JWT_SECRET!, {
    //   expiresIn: "1d"
    // });

    // Create response
    const response = NextResponse.json({
      user:user,
      message: "Login successful",
      success: true,
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
// export default {loginUser as POST}; If arrow function used