import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const client = new GoogleGenerativeAI(process.env.ANTHROPIC_API_KEY || "");

const VALID_POSES = [
  "explain","think","laptop","wow","thumbs","teach","warn","ask","cheer","sit"
];

export async function POST(req: NextRequest) {
  const { topic } = await req.json();
  if (!topic) return NextResponse.json({ error: "موضوع خالی است" }, { status: 400 });

  const systemPrompt = `You are an expert Persian educational content creator specializing in short-form video (Reels/TikTok).
Given a topic, generate exactly 8 educational slides in JSON format.

Each slide must have:
- slideNumber (1-8)
- title: short Persian title (max 4 words)
- text: engaging Persian text for the slide card (max 8 words), written in a conversational tone
- pose: one of [${VALID_POSES.join(", ")}] — choose the most fitting pose for the slide's message

Rules:
- Build a logical narrative arc: hook → why → steps → tip → mistake → trick → tool → CTA
- Keep text punchy and conversational, like a Persian Gen-Z educator
- Vary poses meaningfully, don't repeat the same pose consecutively
- Return ONLY valid JSON, no explanation, no markdown, no backticks

Format:
{"slides": [...]}`;

const userPrompt = String("Topic: " + topic);
  try {
    const model = client.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(systemPrompt + "\n" + userPrompt);
    const raw = result.response.text().replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.slides)) throw new Error("فرمت پاسخ نادرست");
    return NextResponse.json(parsed);
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json(
      { error: "خطا در تولید اسلاید. لطفاً دوباره امتحان کنید." },
      { status: 500 }
    );
  }
}
  
}
