import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
// 💡 Clerkの認証情報とPrismaを読み込む
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

// ⭐ 既存：リトライ（変更なし）
async function retryGenerate(model: any, prompt: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (err: any) {
      const is503 = err?.status === 503;

      if (!is503 || i === retries - 1) {
        throw err;
      }

      const delay = 1000 * Math.pow(2, i);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, level, mode } = body;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    // ⭐ 既存：プロンプト（変更なし）
    const isJapanese = mode === "jp";

    const prompt = `
You are an academic researcher.

Convert the following input into a structured academic paper.

IMPORTANT:
- You MUST follow the format EXACTLY
- You MUST NOT change section titles
- Section titles MUST be EXACTLY as written below
- Do NOT add explanations outside the format
- Content language: ${isJapanese ? "Japanese" : "English"}

FORMAT:

Title:
${isJapanese ? "（日本語で書く）" : ""}

Abstract:
${isJapanese ? "（日本語で書く）" : ""}

Introduction:
${isJapanese ? "（日本語で書く）" : ""}

Methods:
${isJapanese ? "（日本語で書く）" : ""}

Results:
${isJapanese ? "（日本語で書く）" : ""}

Discussion:
${isJapanese ? "（日本語で書く）" : ""}

Conclusion:
${isJapanese ? "（日本語で書く）" : ""}

References:
${isJapanese ? "（日本語または英語）" : ""}

INPUT:
${text}
`;

    let aiText: string;

    try {
      aiText = await retryGenerate(model, prompt, 3);
    } catch (err) {
      console.error("AI完全失敗:", err);

      // ⭐ ここだけ修正：日本語対応フォールバック
      aiText = isJapanese
        ? `
Title: 一時的な生成エラーに関する考察

Abstract:
現在、AIサーバーへの負荷が高いため、論文生成に失敗した。本研究では、このような負荷状況がシステムに与える影響について簡単に考察する。

Introduction:
近年、生成AIの利用拡大に伴い、サーバー負荷の問題が顕在化している。

Methods:
本研究では再試行処理を用いたが、生成には至らなかった。

Results:
十分な結果は得られなかった。

Discussion:
一時的な問題であり、時間を置くことで解決する可能性が高い。

Conclusion:
再試行が推奨される。

References:
なし
`
        : `
Title: Temporary Failure Paper

Abstract:
The AI server was under heavy load.

Introduction:
The system experienced high demand.

Methods:
Retry attempts failed.

Results:
No result was generated.

Discussion:
Please try again later.

Conclusion:
Temporary issue.

References:
None
`;
    }

    // ⭐ 既存：パース（変更なし）
    const extract = (label: string) => {
      const regex = new RegExp(`${label}:([\\s\\S]*?)(?=\\n[A-Z][a-z]+:|$)`);
      return aiText.match(regex)?.[1]?.trim() || "";
    };

    return NextResponse.json({
      title: extract("Title"),
      abstract: extract("Abstract"),
      introduction: extract("Introduction"),
      methods: extract("Methods"),
      results: extract("Results"),
      discussion: extract("Discussion"),
      conclusion: extract("Conclusion"),
      references: extract("References"),
    });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "生成に失敗しました", details: error.message },
      { status: 500 }
    );
  }
}