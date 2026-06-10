import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const VALID_POSES = ["explain","think","laptop","wow","thumbs","teach","warn","ask","cheer","sit"];

export async function POST(req: NextRequest) {
  const { topic } = await req.json();
  if (!topic) return NextResponse.json({ error: "موضوع خالی است" }, { status: 400 });

  const prompt = "You are a Persian educational content creator for Reels/TikTok. Generate exactly 8 slides in JSON format. Each slide has: slideNumber (1-8), title (short Persian, max 4 words), text (Persian, max 8 words), pose (one of: explain,think,laptop,wow,thumbs,teach,warn,ask,cheer,sit). Return ONLY valid JSON like: {\"slides\": [...]}. Topic: " + topic;

  try {
    const model = client.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const raw = result.response.text().replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.slides)) throw new Error("bad format");
    return NextResponse.json(parsed);
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json({ error: "خطا در تولید اسلاید" }, { status: 500 });
  }
}
