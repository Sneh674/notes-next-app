import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!; // Ensure it's set in .env

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables.");
}

export interface TokenPayload {
  id: string;
  email: string;
}

// Generate JWT Token
export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" }); 
};

// Verify JWT Token
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};
