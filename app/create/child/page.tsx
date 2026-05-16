"use client";

import { useState } from "react";
import Link from "next/link";

export default function CreatePaper() {
  const [mode, setMode] = useState<"auto" | "manual">("auto");
  const [hakaseLevel, setHakaseLevel] = useState(3);
  
  // 💡 AI連携のための新しい変数（状態）
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [paperData, setPaperData] = useState<any>(null); // 生成された論文データを保存する箱

  // 🤖 AIに執筆を依頼する関数
  const handleGenerate = async () => {
    if (!text) {
      alert("どんなことがあったか入力してね！");
      return;
    }

    setIsLoading(true);
    try {
      // APIにデータを送信（modeを 'child' として送ります）
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: text, 
          level: hakaseLevel, 
          mode: 'child' 
        }),
      });

      if (!response.ok) throw new Error("APIエラー");

      const data = await response.json();
      setPaperData(data); // 受け取ったデータを保存して画面を切り替える

    } catch (error) {
      console.error(error);
      alert("ごめんね、エラーがおきちゃったみたい。もういちど試してみてね！");
    } finally {
      setIsLoading(false);
    }
  };

  // 📄 PDFとして保存（印刷ダイアログを呼び出す）
  const handleDownloadPDF = () => {
    window.print();
  };

  // 🌟 AIの生成が完了している場合は、こちらの「プレビュー＆印刷画面」を表示する
  if (paperData) {
    return (
      <div className="min-h-screen bg-stone-100 py-10 font-sans print:bg-white print:p-0 print:m-0">
        <div className="max-w-4xl mx-auto px-4 print:p-0">
          
          {/* PDF出力時には非表示になる操作ボタン群 */}
          <div className="flex justify-between items-center mb-8 print:hidden">
            <button 
              onClick={() => setPaperData(null)}
              className="text-stone-500 font-bold hover:text-stone-800 transition"
            >
              ◁ やりなおす
            </button>
            <div className="text-center">
              <button 
                onClick={handleDownloadPDF}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105"
              >
                📄 PDFとして保存・印刷する
              </button>
              <p className="text-stone-500 text-xs mt-3">
                ※印刷画面が開いたら、送信先を「PDFに保存」に変更してね！
              </p>
            </div>
          </div>

          {/* 💡 論文のプレビュー領域（2段組・文字切れ防止設定済み） */}
          <div id="paper-content" className="bg-white p-10 shadow-lg text-sm text-stone-900 mx-auto max-w-[210mm] print:shadow-none print:m-0 print:p-0">
            <header className="mb-8 text-center break-inside-avoid">
              <h1 className="text-3xl font-bold mb-4">{paperData.title}</h1>
              <div className="text-left bg-stone-100 p-4 rounded-xl text-sm border-2 border-dashed border-stone-300">
                <h2 className="font-bold mb-1 text-amber-700">🌻 どんな研究？ (Abstract)</h2>
                <p>{paperData.abstract}</p>
              </div>
            </header>

            <div className="columns-2 gap-8 text-justify">
              <div className="break-inside-avoid mb-6">
                <h3 className="font-bold border-b-2 border-amber-500 mb-2 text-lg text-amber-800">1. はじめに</h3>
                <p>{paperData.introduction}</p>
              </div>
              <div className="break-inside-avoid mb-6">
                <h3 className="font-bold border-b-2 border-amber-500 mb-2 text-lg text-amber-800">2. やりかた</h3>
                <p>{paperData.methods}</p>
              </div>
              <div className="break-inside-avoid mb-6">
                <h3 className="font-bold border-b-2 border-amber-500 mb-2 text-lg text-amber-800">3. わかったこと</h3>
                <p>{paperData.results}</p>
              </div>
              <div className="break-inside-avoid mb-6">
                <h3 className="font-bold border-b-2 border-amber-500 mb-2 text-lg text-amber-800">4. かんがえたこと</h3>
                <p>{paperData.discussion}</p>
              </div>
              <div className="break-inside-avoid mb-6">
                <h3 className="font-bold border-b-2 border-amber-500 mb-2 text-lg text-amber-800">5. まとめ</h3>
                <p>{paperData.conclusion}</p>
              </div>
              <div className="break-inside-avoid mb-6">
                <h3 className="font-bold border-b-2 border-amber-500 mb-2 text-lg text-amber-800">さんこうにしたもの</h3>
                <ul className="list-disc pl-5 text-xs text-stone-600">
                  <li>{paperData.references}</li>
                </ul>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    );
  }

  // 🌟 AI生成前の入力画面
  return (
    <div className="min-h-screen bg-sky-50 text-gray-800 font-sans pb-20">
      <header className="bg-white px-4 py-4 shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center">
          <Link href="/" className="text-blue-500 font-bold hover:bg-blue-50 px-3 py-2 rounded-lg transition">
            ◁ もどる
          </Link>
          <h1 className="text-xl font-bold ml-auto mr-auto text-slate-800">
            あたらしい論文をかく ✏️
          </h1>
          <div className="w-16"></div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 mt-8">
        <div className="bg-white p-2 rounded-full shadow-sm flex mb-8 border border-gray-200">
          <button
            onClick={() => setMode("auto")}
            className={`flex-1 py-3 text-lg font-bold rounded-full transition ${mode === "auto" ? "bg-blue-600 text-white shadow-md" : "text-gray-500 hover:bg-gray-100"}`}
          >
            🤖 AIにおまかせ
          </button>
          <button
            onClick={() => setMode("manual")}
            className={`flex-1 py-3 text-lg font-bold rounded-full transition ${mode === "manual" ? "bg-green-600 text-white shadow-md" : "text-gray-500 hover:bg-gray-100"}`}
          >
            ✍️ じぶんで書く
          </button>
        </div>

        {mode === "auto" && (
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-200 animate-fade-in">
            <div className="border-4 border-dashed border-sky-200 rounded-2xl p-8 text-center mb-6 hover:bg-sky-50 transition cursor-pointer">
              <span className="text-4xl mb-2 block">📸</span>
              <p className="font-bold text-sky-700">しゃしんを いれる（3まいまで）</p>
              <p className="text-sm text-sky-500 mt-1">※自由研究のしょうこ画像</p>
            </div>

            <div className="mb-8">
              <label className="block text-lg font-bold text-gray-700 mb-2">
                どんなことがあった？（くわしく教えて！）
              </label>
              <textarea 
                value={text}
                onChange={(e) => setText(e.target.value)} // 💡 入力された文字を変数に保存
                className="w-full h-40 p-4 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none text-lg resize-none bg-gray-50"
                placeholder="例：きのう、コーヒーをカップにいれたまま、ねおちしてしまった。あさおきたら、カップの底にモヤモヤしたものがあった。"
              ></textarea>
            </div>

            <div className="mb-10 bg-sky-50 p-6 rounded-2xl">
              <label className="block text-lg font-bold text-gray-700 mb-4 text-center">
                どのくらい「はかせ」っぽくする？ 🎓
              </label>
              <input 
                type="range" 
                min="1" max="5" 
                value={hakaseLevel}
                onChange={(e) => setHakaseLevel(Number(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-sm font-bold mt-3 text-gray-600">
                <span>レベル1<br/>(ふつうの日記)</span>
                <span>レベル3<br/>(ちょっとかしこい)</span>
                <span>レベル5<br/>(ノーベル賞級！)</span>
              </div>
            </div>

            <button 
              onClick={handleGenerate} // 💡 送信ボタンをクリックした時の処理を追加
              disabled={isLoading}
              className={`w-full text-white font-bold py-5 rounded-2xl text-xl shadow-lg transition transform hover:-translate-y-1 ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              {isLoading ? "⏳ AIが いっしょうけんめい 書いています..." : "✨ AIに 論文にしてもらう ✨"}
            </button>
          </div>
        )}

        {/* ---------------- 【じぶんで書く】モードの画面 ---------------- */}
        {mode === "manual" && (
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-200 animate-fade-in">
            <p className="text-center text-gray-600 mb-6 font-bold">
              じぶんで 8つの項目（こうもく）をうめてみよう！
            </p>
            
            <div className="space-y-5">
              {[
                { label: "1. タイトル (Title)", placeholder: "研究のなまえ" },
                { label: "2. どんな研究？ (Abstract)", placeholder: "みじかく まとめよう" },
                { label: "3. はじめに (Introduction)", placeholder: "どうして これを調べようと思ったの？" },
                { label: "4. やりかた (Methods)", placeholder: "どんな方法で しらべたの？" },
                { label: "5. わかったこと (Results)", placeholder: "なにが おきた？（結果）" },
                { label: "6. かんがえたこと (Discussion)", placeholder: "どうして そうなったと思う？" },
                { label: "7. まとめ (Conclusion)", placeholder: "さいごの まとめ！" },
                { label: "8. さんこうにしたもの (References)", placeholder: "調べた本や、ウェブサイトのURL" },
              ].map((item, index) => (
                <div key={index}>
                  <label className="block font-bold text-gray-700 mb-1">{item.label}</label>
                  <input 
                    type="text" 
                    placeholder={item.placeholder}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none bg-gray-50"
                  />
                </div>
              ))}
            </div>

            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-5 rounded-2xl text-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 mt-8">
              💾 かくにん画面へすすむ
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

