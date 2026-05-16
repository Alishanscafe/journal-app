"use client";

import { useState, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { pdf } from "@react-pdf/renderer";
import PaperPDF from "@/components/PaperPDF";

function CreatePaperContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") || "adult";
  
  const [inputText, setInputText] = useState("");
  const [status, setStatus] = useState<"input" | "loading" | "result">("input");
  const [generatedData, setGeneratedData] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const paperRef = useRef<HTMLDivElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImageUrl(URL.createObjectURL(file));
  };

  const handleGenerate = async () => {
    if (!inputText) return alert("出来事を入力してください！");
    setStatus("loading");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ text: inputText, mode }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setGeneratedData(data);
      setStatus("result");
    } catch (e: any) {
      alert(e.message);
      setStatus("input");
    }
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);

    try {
      const blob = await pdf(
        <PaperPDF data={generatedData} imageUrl={imageUrl} />
      ).toBlob();

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${generatedData.title}.pdf`;
      a.click();

      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("PDF生成失敗");
    } finally {
      setIsDownloading(false);
    }
  };

  // ---------------- 入力 ----------------
  if (status === "input") {
    return (
      <div className="min-h-screen bg-stone-50 pt-10">
        <div className="max-w-3xl mx-auto bg-white p-8 shadow">
          <h1 className="text-xl font-bold mb-6">日々是論文（研究者モード）</h1>

          {/* ⭐ ここだけ追加：言語切替UI */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => window.location.href = "/create/adult?mode=adult"}
              className={`px-4 py-2 rounded font-bold border transition ${
                mode === "adult"
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-gray-300 hover:bg-gray-100"
              }`}
            >
              English Mode
            </button>

            <button
              onClick={() => window.location.href = "/create/adult?mode=jp"}
              className={`px-4 py-2 rounded font-bold border transition ${
                mode === "jp"
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-gray-300 hover:bg-gray-100"
              }`}
            >
              日本語モード
            </button>
          </div>

          <label>
            <span className="font-bold">📸 証拠写真</span>
            <input type="file" hidden id="file" onChange={handleImageChange}/>
            <label htmlFor="file" className="block mt-2 bg-black text-white px-4 py-2 cursor-pointer">
              画像を選択
            </label>
          </label>

          {imageUrl && <img src={imageUrl} className="h-32 mt-2 border" />}

          <textarea
            className="w-full h-40 border mt-4 p-2"
            value={inputText}
            onChange={(e)=>setInputText(e.target.value)}
            placeholder={
              mode === "jp"
                ? "ここに出来事を日本語で入力してください..."
                : "Describe your daily event here..."
            }
          />

          <button onClick={handleGenerate} className="mt-4 w-full bg-black text-white p-3">
            生成
          </button>
        </div>
      </div>
    );
  }

  // ---------------- ロード ----------------
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <div className="text-6xl animate-spin mb-6">🧠</div>
        <h2>論文執筆中</h2>
        <div className="text-gray-400 mt-4 text-center">
          <p>無駄に難解な表現にしております．．．</p>
          <p>先行研究を「創作」．．．</p>
          <p>それっぽい結論を生成中...</p>
        </div>
      </div>
    );
  }

  // ---------------- 結果 ----------------
  if (status === "result" && generatedData) {
    return (
      <div className="min-h-screen bg-[#525659] p-10">

        <div ref={paperRef} className="a4-page bg-white p-10">
          <h1 className="text-center text-[16pt] mb-6">{generatedData.title}</h1>
          <p>{generatedData.abstract}</p>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="bg-blue-600 text-white px-6 py-3"
          >
            {isDownloading ? "作成中..." : "PDFダウンロード"}
          </button>
        </div>
      </div>
    );
  }
}

export default function CreatePaper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreatePaperContent />
    </Suspense>
  );
}