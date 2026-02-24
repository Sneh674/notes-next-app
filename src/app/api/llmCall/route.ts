// import { NextRequest, NextResponse } from "next/server";
// import { verifyToken } from "@/helpers/jwt";

export const callHuggingFace = async (prompt: string) => {
    const response = await fetch(
        // "https://router.huggingface.co/hf-inference/models/google/gemma-2b-it",
        "https://router.huggingface.co/v1/chat/completions",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.HF_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "mistralai/Mistral-7B-Instruct-v0.2",
                messages: [
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                max_tokens: 1000,
                temperature: 0.7,
            }),
        }
    );

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
    }

    const data = await response.json();
    // console.log("Hugging Face API response:", data);
    // console.log("Generated Text:", data.choices[0].message.content);
    // return data[0].generated_text;
    return data.choices[0].message.content;
};