import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { SHOULDER_SECRETARY_PROMPT } from "@/lib/prompts/shoulderSecretary";
import type {
  Tone,
  ShoulderSecretaryResponse,
} from "@/types/shoulderSecretary";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || ""
);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

// ------------------------------
// 簡易レート制限（メモリ上）
// 1IPにつき1分間に10回まで
// ※ Vercelのサーバーレス環境では永続化されないため、MVP向け
// ------------------------------
const rateLimitStore = new Map<
  string,
  { count: number; resetAt: number }
>();

const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 10;

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return "unknown";
}

function checkRateLimit(ip: string): {
  allowed: boolean;
  remaining: number;
  resetIn: number;
} {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitStore.set(ip, {
      count: 1,
      resetAt: now + WINDOW_MS,
    });

    return {
      allowed: true,
      remaining: MAX_REQUESTS - 1,
      resetIn: WINDOW_MS,
    };
  }

  if (record.count >= MAX_REQUESTS) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: record.resetAt - now,
    };
  }

  record.count += 1;

  return {
    allowed: true,
    remaining: MAX_REQUESTS - record.count,
    resetIn: record.resetAt - now,
  };
}

// ------------------------------
// リトライ処理
// ------------------------------
function sleep(ms: number) {
  return new Promise((resolve) =>
    setTimeout(resolve, ms)
  );
}

function isRateLimitError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  return (
    error.message.includes("429") ||
    error.message.includes("Too Many Requests") ||
    error.message.includes("quota")
  );
}

async function generateWithRetry(
  prompt: string,
  maxRetries = 3
): Promise<string> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      lastError = error;

      if (
        !isRateLimitError(error) ||
        attempt === maxRetries
      ) {
        throw error;
      }

      // 1秒 → 2秒 → 4秒
      const delay = Math.pow(2, attempt) * 1000;
      await sleep(delay);
    }
  }

  throw lastError;
}

/**
 * 文字列から最初のJSONオブジェクトを抽出する
 */
function extractJson(text: string): string | null {
  // ```json ... ``` を優先的に抽出
  const fencedMatch = text.match(/```json\s*([\s\S]*?)\s*```/i);
  if (fencedMatch) {
    return fencedMatch[1].trim();
  }

  // ``` ... ``` でもJSONらしければ抽出
  const codeBlockMatch = text.match(/```\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch) {
    const candidate = codeBlockMatch[1].trim();
    if (candidate.startsWith("{") && candidate.endsWith("}")) {
      return candidate;
    }
  }

  // 最初の { から最後の } までを抽出
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return text.slice(firstBrace, lastBrace + 1).trim();
  }

  return null;
}

/**
 * 最低限の構造検証
 */
function isValidResponse(
  data: unknown
): data is ShoulderSecretaryResponse {
  if (!data || typeof data !== "object") return false;

  const obj = data as Record<string, unknown>;

  if (!obj.analysis || typeof obj.analysis !== "object") {
    return false;
  }

  if (!obj.rewritten || typeof obj.rewritten !== "object") {
    return false;
  }

  if (!Array.isArray(obj.warnings)) {
    return false;
  }

  const analysis = obj.analysis as Record<string, unknown>;
  const rewritten = obj.rewritten as Record<string, unknown>;

  return (
    typeof analysis.emotion === "string" &&
    Array.isArray(analysis.facts) &&
    typeof analysis.request === "string" &&
    typeof rewritten.subject === "string" &&
    typeof rewritten.body === "string"
  );
}

/**
 * 不完全なレスポンスでもUIが壊れないよう補完する
 */
function normalizeResponse(
  data: Partial<ShoulderSecretaryResponse>
): ShoulderSecretaryResponse {
  return {
    analysis: {
      emotion: data.analysis?.emotion ?? "不明",
      facts: Array.isArray(data.analysis?.facts)
        ? data.analysis!.facts
        : [],
      request: data.analysis?.request ?? "",
    },
    rewritten: {
      subject: data.rewritten?.subject ?? "件名なし",
      body:
        data.rewritten?.body ??
        "変換結果を取得できませんでした。",
    },
    warnings: Array.isArray(data.warnings)
      ? data.warnings
      : [],
  };
}

export async function POST(req: NextRequest) {
  try {
    // 1. IP単位のレート制限
    const ip = getClientIp(req);
    const limit = checkRateLimit(ip);

    if (!limit.allowed) {
      return NextResponse.json(
        {
          error:
            "利用回数の上限に達しました。1分ほど待ってから再度お試しください。",
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil(
              limit.resetIn / 1000
            ).toString(),
          },
        }
      );
    }

    // 2. 入力取得
    const { text, tone }: { text?: string; tone?: Tone } =
      await req.json();

    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: "文章を入力してください。" },
        { status: 400 }
      );
    }

    // 3. プロンプト生成
    const prompt = `
${SHOULDER_SECRETARY_PROMPT}

ユーザー入力:
${text}

指定トーン:
${tone || "business"}
`;

    // 4. リトライ付きで実行
    const responseText = await generateWithRetry(
      prompt,
      3
    );

    // 5. JSON抽出
    const jsonText = extractJson(responseText);

    if (!jsonText) {
      throw new Error(
        "AIの応答からJSONを抽出できませんでした。"
      );
    }

    // 6. JSON解析
    let parsed: unknown;

    try {
      parsed = JSON.parse(jsonText);
    } catch (error) {
      console.error("JSON Parse Error:", error);
      console.error("Raw Response:", responseText);
      console.error("Extracted JSON:", jsonText);

      throw new Error("JSONの解析に失敗しました。");
    }

    // 7. 完全一致ならそのまま返す
    if (isValidResponse(parsed)) {
      return NextResponse.json(parsed, {
        headers: {
          "X-RateLimit-Remaining":
            limit.remaining.toString(),
        },
      });
    }

    // 8. 部分的に欠けていても補完して返す
    if (parsed && typeof parsed === "object") {
      const normalized = normalizeResponse(
        parsed as Partial<ShoulderSecretaryResponse>
      );

      return NextResponse.json(normalized, {
        headers: {
          "X-RateLimit-Remaining":
            limit.remaining.toString(),
        },
      });
    }

    throw new Error(
      "AIの応答形式が想定と異なります。"
    );
  } catch (error) {
    console.error(
      "Shoulder Secretary API Error:",
      error
    );

    // Gemini側の429
    if (isRateLimitError(error)) {
      return NextResponse.json(
        {
          error:
            "Gemini API の利用上限に達しました。Google AI Studioで使用量をご確認いただくか、新しいAPIキーをご利用ください。",
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        error:
          "文章の変換中にエラーが発生しました。時間をおいて再度お試しください。",
      },
      { status: 500 }
    );
  }
}