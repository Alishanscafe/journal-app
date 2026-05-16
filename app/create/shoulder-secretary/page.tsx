"use client";

import { useState } from "react";
import type {
  Tone,
  ShoulderSecretaryResponse,
} from "@/types/shoulderSecretary";

export default function ShoulderSecretaryPage() {
  const [text, setText] = useState("");
  const [tone, setTone] = useState<Tone>("business");
  const [loading, setLoading] = useState(false);
  const [result, setResult] =
    useState<ShoulderSecretaryResponse | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/shoulder-secretary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          tone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "変換に失敗しました。"
        );
      }

      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "不明なエラーが発生しました。"
      );
    } finally {
      setLoading(false);
    }
  };

  const copyBody = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(
      result.rewritten.body
    );
  };

  const copyAll = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(
      `件名: ${result.rewritten.subject}\n\n${result.rewritten.body}`
    );
  };

  const downloadJson = () => {
    if (!result) return;

    const json = JSON.stringify(result, null, 2);
    const blob = new Blob([json], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;

    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, "-");

    a.download = `shoulder-secretary-${timestamp}.json`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  };

  const downloadEmail = () => {
    if (!result) return;

    const content =
      `件名: ${result.rewritten.subject}\n\n` +
      result.rewritten.body;

    const blob = new Blob([content], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;

    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, "-");

    a.download = `shoulder-secretary-email-${timestamp}.txt`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  };

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          肩の上の秘書
        </h1>
        <p className="text-gray-600 mt-2">
          感情的な文章を、建設的なビジネスメールに変換します。
        </p>
      </div>

      <div className="space-y-4">
        <textarea
          className="w-full min-h-[200px] border rounded-lg p-4"
          placeholder="ここに感情的な文章を入力してください"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <select
          className="border rounded px-3 py-2"
          value={tone}
          onChange={(e) =>
            setTone(e.target.value as Tone)
          }
        >
          <option value="soft">柔らかい</option>
          <option value="business">ビジネス</option>
          <option value="firm">明確に伝える</option>
          <option value="concise">簡潔</option>
        </select>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 active:translate-y-0.5 active:shadow-sm transition-all duration-100 disabled:opacity-50 disabled:shadow-none"
        >
          {loading ? "変換中..." : "変換する"}
        </button>
      </div>

      {error && (
        <div className="border border-red-300 bg-red-50 text-red-700 p-4 rounded">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-6">
          <section className="border rounded-lg p-4 bg-gray-50">
            <h2 className="font-semibold mb-2">
              肩の上の秘書　の分析結果
            </h2>
            <p>
              <strong>感情:</strong>{" "}
              {result.analysis.emotion}
            </p>
            <p>
              <strong>事実:</strong>{" "}
              {result.analysis.facts.join(" / ")}
            </p>
            <p>
              <strong>要望:</strong>{" "}
              {result.analysis.request}
            </p>
          </section>

          <section className="border rounded-lg p-4">
            <h2 className="font-semibold mb-2">件名</h2>
            <p className="mb-4">
              {result.rewritten.subject}
            </p>

            <h2 className="font-semibold mb-2">
              本文
            </h2>
            <pre className="whitespace-pre-wrap font-sans bg-gray-50 p-4 rounded">
              {result.rewritten.body}
            </pre>

            <div className="flex gap-3 mt-4 flex-wrap">
              <button
                onClick={copyBody}
                className="border px-4 py-2 rounded shadow-sm hover:bg-gray-50 active:translate-y-0.5 active:shadow-none transition-all duration-100"
              >
                本文をコピー
              </button>

              <button
                onClick={copyAll}
                className="border px-4 py-2 rounded shadow-sm hover:bg-gray-50 active:translate-y-0.5 active:shadow-none transition-all duration-100"
              >
                件名＋本文をコピー
              </button>

              <button
                onClick={downloadEmail}
                className="border px-4 py-2 rounded shadow-sm hover:bg-gray-50 active:translate-y-0.5 active:shadow-none transition-all duration-100"
              >
                メール文をダウンロード
              </button>

            </div>
          </section>

          {result.warnings.length > 0 && (
            <section className="border rounded-lg p-4 bg-yellow-50">
              <h2 className="font-semibold mb-2">
                注意点
              </h2>
              <ul className="list-disc ml-6">
                {result.warnings.map(
                  (warning, index) => (
                    <li key={index}>{warning}</li>
                  )
                )}
              </ul>
            </section>
          )}
        </div>
      )}
    </main>
  );
}