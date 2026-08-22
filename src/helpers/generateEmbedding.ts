import { InferenceClient } from "@huggingface/inference";

const EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2";
const client = new InferenceClient(process.env.HF_TOKEN);

export default async function generateEmbedding(text: string): Promise<number[]> {
    if (!process.env.HF_TOKEN) {
        throw new Error("HF_TOKEN is not configured");
    }

    const output = await client.featureExtraction({
        model: EMBEDDING_MODEL,
        inputs: text,
        normalize: true,
    });

    return (output as Array<number | number[]>).flat(Infinity) as number[];
}
