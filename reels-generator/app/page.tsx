"use client";
import { useState } from "react";

const BASE_CHAR =
  "A 3D cartoon-style male character, Pixar/Disney animation style, short dark black hair with fade haircut, dark brown eyes, trimmed black beard, warm tan skin, white t-shirt, blue jeans, white sneakers. Solid blue background. High quality 3D render, soft lighting, centered.";

const POSES = [
  { id: "explain", emoji: "☝️", label: "توضیح دادن", en: "pointing index finger upward, friendly smile" },
  { id: "think",   emoji: "🤔", label: "فکر کردن",   en: "hand on chin, thinking pose, looking upward" },
  { id: "laptop",  emoji: "💻", label: "لپتاپ",       en: "holding open laptop toward viewer, excited" },
  { id: "wow",     emoji: "😲", label: "تعجب",        en: "surprised, wide eyes, hands raised" },
  { id: "thumbs",  emoji: "👍", label: "تأیید",       en: "big thumbs up, wide smile" },
  { id: "teach",   emoji: "📚", label: "تدریس",       en: "pointing at a floating whiteboard panel" },
  { id: "warn",    emoji: "⚠️", label: "نکته مهم",    en: "both hands raised in warning gesture" },
  { id: "ask",     emoji: "❓", label: "سؤال",        en: "palms up, questioning expression" },
  { id: "cheer",   emoji: "🎉", label: "موفقیت",      en: "arms raised in celebration, big smile" },
  { id: "sit",     emoji: "🪑", label: "نشسته",       en: "sitting casually, relaxed, confident" },
];

type Slide = {
  slideNumber: number;
  title: string;
  text: string;
  pose: string;
};

type Prompt = {
  slide: Slide;
  pose: typeof POSES[0];
  prompt: string;
};

export default function Home() {
  const [topic, setTopic] = useState("");
  const [slides, setSlides] = useState<Slide[]>([]);
  const [sel, setSel] = useState<number[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [step, setStep] = useState(1);
  const [copied, setCopied] = useState<string | number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function doStep1() {
    if (!topic.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate-slides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا در تولید اسلاید");
      setSlides(data.slides);
      setSel([]);
      setStep(2);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "خطای ناشناخته");
    } finally {
      setLoading(false);
    }
  }

  function doStep2() {
    if (sel.length === 0) return;
    const chosen = [...sel].sort((a, b) => a - b).map((i) => slides[i]);
    setPrompts(
      chosen.map((slide) => {
        const pose = POSES.find((p) => p.id === slide.pose) || POSES[0];
        return {
          slide,
          pose,
          prompt: `${BASE_CHAR} The character is ${pose.en}. A clean floating white card shows the text: "${slide.text}". Modern card UI, rounded corners, soft drop shadow. --ar 9:16 --style raw --q 2`,
        };
      })
    );
    setStep(3);
  }

  function copyText(text: string, id: string | number) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  const toggle = (i: number) =>
    setSel((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));
  const reset = () => {
    setStep(1);
    setTopic("");
    setSlides([]);
    setSel([]);
    setPrompts([]);
    setError("");
  };
  const selectAll = () => setSel(slides.map((_, i) => i));

  return (
    <div
      style={{
        fontFamily: "Tahoma,sans-serif",
        direction: "rtl",
        minHeight: "100vh",
        background: "linear-gradient(160deg,#06061a,#0d1b4b,#06061a)",
        color: "#fff",
        padding: "20px 14px",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "22px" }}>
        <div style={{ fontSize: "34px" }}>🎬</div>
        <h1
          style={{
            fontSize: "18px",
            fontWeight: "700",
            margin: "5px 0 3px",
            background: "linear-gradient(90deg,#60a5fa,#a78bfa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          ساخت ریلز آموزشی
        </h1>
        <p style={{ color: "#64748b", fontSize: "11px", margin: 0 }}>
          موضوع بنویس ← اسلاید انتخاب کن ← پرامپت بگیر
        </p>
      </div>

      {/* Step indicator */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "5px",
          marginBottom: "20px",
        }}
      >
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            style={{ display: "flex", alignItems: "center", gap: "5px" }}
          >
            <div
              style={{
                width: "25px",
                height: "25px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                fontWeight: "700",
                background:
                  step >= n
                    ? "linear-gradient(135deg,#3b82f6,#8b5cf6)"
                    : "#1a2340",
                color: step >= n ? "#fff" : "#4a5568",
              }}
            >
              {n}
            </div>
            {n < 3 && (
              <div
                style={{
                  width: "22px",
                  height: "2px",
                  background: step > n ? "#3b82f6" : "#1a2340",
                }}
              />
            )}
          </div>
        ))}
      </div>

      <div style={{ maxWidth: "500px", margin: "0 auto" }}>
        {/* STEP 1 */}
        {step === 1 && (
          <div
            style={{
              background: "#0f1729",
              borderRadius: "14px",
              padding: "18px",
              border: "1px solid #1e3a6e",
            }}
          >
            <label
              style={{
                fontSize: "12px",
                color: "#94a3b8",
                display: "block",
                marginBottom: "8px",
              }}
            >
              موضوع آموزشی ریلزت چیه؟
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && doStep1()
              }
              placeholder="مثال: پرامپت نویسی / ChatGPT / Midjourney"
              rows={3}
              style={{
                width: "100%",
                background: "#1a2340",
                border: "1px solid #2d4a8a",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "14px",
                padding: "10px",
                resize: "none",
                outline: "none",
                boxSizing: "border-box",
                fontFamily: "Tahoma,sans-serif",
              }}
            />
            {error && (
              <p style={{ color: "#f87171", fontSize: "11px", marginTop: "6px" }}>
                ⚠️ {error}
              </p>
            )}
            <button
              onClick={doStep1}
              disabled={!topic.trim() || loading}
              style={{
                marginTop: "12px",
                width: "100%",
                padding: "13px",
                borderRadius: "9px",
                border: "none",
                cursor: !topic.trim() || loading ? "not-allowed" : "pointer",
                background:
                  !topic.trim() || loading
                    ? "#1a2340"
                    : "linear-gradient(135deg,#3b82f6,#8b5cf6)",
                color: "#fff",
                fontSize: "14px",
                fontWeight: "700",
              }}
            >
              {loading ? "🤖 در حال تولید اسلاید..." : "🚀 پیشنهاد اسلاید بده"}
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                اسلایدها رو انتخاب کن:
              </span>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <button
                  onClick={selectAll}
                  style={{
                    fontSize: "10px",
                    color: "#60a5fa",
                    background: "transparent",
                    border: "1px solid #1e3a6e",
                    borderRadius: "6px",
                    padding: "3px 8px",
                    cursor: "pointer",
                  }}
                >
                  همه
                </button>
                <span style={{ fontSize: "11px", color: "#60a5fa" }}>
                  {sel.length} انتخاب
                </span>
              </div>
            </div>
            {slides.map((s, i) => {
              const pose = POSES.find((p) => p.id === s.pose);
              return (
                <div
                  key={i}
                  onClick={() => toggle(i)}
                  style={{
                    background: sel.includes(i)
                      ? "linear-gradient(135deg,#1e3a6e,#2d1b6e)"
                      : "#0f1729",
                    border: sel.includes(i)
                      ? "1.5px solid #3b82f6"
                      : "1px solid #1e2a4a",
                    borderRadius: "10px",
                    padding: "10px 12px",
                    marginBottom: "7px",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", gap: "9px" }}>
                    <div
                      style={{
                        width: "17px",
                        height: "17px",
                        borderRadius: "50%",
                        background: sel.includes(i) ? "#3b82f6" : "transparent",
                        border: sel.includes(i)
                          ? "2px solid #3b82f6"
                          : "2px solid #374151",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "9px",
                        flexShrink: 0,
                        marginTop: "2px",
                      }}
                    >
                      {sel.includes(i) ? "✓" : ""}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "12px",
                            fontWeight: "600",
                            color: sel.includes(i) ? "#93c5fd" : "#e2e8f0",
                            marginBottom: "2px",
                          }}
                        >
                          {s.slideNumber}. {s.title}
                        </div>
                        <span style={{ fontSize: "10px", color: "#64748b" }}>
                          {pose?.emoji} {pose?.label}
                        </span>
                      </div>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>
                        {s.text}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  flex: 1,
                  padding: "11px",
                  borderRadius: "9px",
                  border: "1px solid #1e2a4a",
                  background: "transparent",
                  color: "#94a3b8",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                ← برگشت
              </button>
              <button
                onClick={doStep2}
                disabled={sel.length === 0}
                style={{
                  flex: 2,
                  padding: "11px",
                  borderRadius: "9px",
                  border: "none",
                  cursor: sel.length === 0 ? "not-allowed" : "pointer",
                  background:
                    sel.length === 0
                      ? "#1a2340"
                      : "linear-gradient(135deg,#3b82f6,#8b5cf6)",
                  color: "#fff",
                  fontSize: "12px",
                  fontWeight: "700",
                }}
              >
                ✨ ساخت پرامپت ({sel.length} اسلاید)
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                پرامپت‌های آماده:
              </span>
              <button
                onClick={() =>
                  copyText(
                    prompts
                      .map(
                        (p, i) =>
                          `=== اسلاید ${i + 1}: ${p.slide.title} ===\n${p.prompt}`
                      )
                      .join("\n\n"),
                    "all"
                  )
                }
                style={{
                  padding: "5px 10px",
                  borderRadius: "7px",
                  border: "1px solid #3b82f6",
                  background: copied === "all" ? "#1e3a6e" : "transparent",
                  color: "#60a5fa",
                  fontSize: "11px",
                  cursor: "pointer",
                }}
              >
                {copied === "all" ? "✓ کپی شد" : "📋 کپی همه"}
              </button>
            </div>
            {prompts.map((p, i) => (
              <div
                key={i}
                style={{
                  background: "#0f1729",
                  border: "1px solid #1e3a6e",
                  borderRadius: "12px",
                  overflow: "hidden",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    background: "linear-gradient(135deg,#1e3a6e,#2d1b6e)",
                    padding: "8px 12px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#93c5fd",
                    }}
                  >
                    {p.pose.emoji} اسلاید {i + 1}: {p.slide.title}
                  </span>
                  <span style={{ fontSize: "10px", color: "#a78bfa" }}>
                    {p.pose.label}
                  </span>
                </div>
                <div style={{ padding: "11px 12px" }}>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#60a5fa",
                      marginBottom: "6px",
                    }}
                  >
                    📝 متن: {p.slide.text}
                  </div>
                  <div
                    style={{
                      background: "#060a14",
                      borderRadius: "7px",
                      padding: "8px",
                      fontSize: "10px",
                      color: "#94a3b8",
                      direction: "ltr",
                      textAlign: "left",
                      fontFamily: "monospace",
                      lineHeight: "1.7",
                      wordBreak: "break-word",
                    }}
                  >
                    {p.prompt}
                  </div>
                  <button
                    onClick={() => copyText(p.prompt, i)}
                    style={{
                      marginTop: "7px",
                      width: "100%",
                      padding: "7px",
                      borderRadius: "7px",
                      border: "1px solid #1e3a6e",
                      background: copied === i ? "#1e3a6e" : "transparent",
                      color: "#60a5fa",
                      fontSize: "11px",
                      cursor: "pointer",
                    }}
                  >
                    {copied === i ? "✓ کپی شد!" : "📋 کپی پرامپت"}
                  </button>
                </div>
              </div>
            ))}
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={reset}
                style={{
                  flex: 1,
                  padding: "11px",
                  borderRadius: "9px",
                  border: "1px solid #1e2a4a",
                  background: "transparent",
                  color: "#94a3b8",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                🔄 شروع مجدد
              </button>
              <button
                onClick={() => setStep(2)}
                style={{
                  flex: 1,
                  padding: "11px",
                  borderRadius: "9px",
                  border: "1px solid #3b82f6",
                  background: "transparent",
                  color: "#60a5fa",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                ← ویرایش
              </button>
            </div>
          </div>
        )}
      </div>
      <p
        style={{
          textAlign: "center",
          marginTop: "22px",
          color: "#1e2a4a",
          fontSize: "10px",
        }}
      >
        Midjourney · Leonardo AI · Adobe Firefly
      </p>
    </div>
  );
}
