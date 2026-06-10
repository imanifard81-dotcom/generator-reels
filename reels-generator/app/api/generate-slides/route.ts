import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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

  const userPrompt = `Topic: ${topic}`;

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const raw = response.content[0].type === "text" ? response.content[0].text : "";
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    // Validate
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
