"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // 💡 ここを本物の送信処理に書き換えました！
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Web3FormsのAPIへデータを送信する
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          // .env.local に設定したアクセスキーを読み込む
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY,
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // 送信成功！
        setIsSuccess(true);
        setFormData({ name: "", email: "", message: "" }); // フォームを空に戻す
      } else {
        // Web3Forms側で何らかのエラーが起きた場合
        alert("送信に失敗しました。もう一度お試しください。");
      }
    } catch (error) {
      // ネットワークエラーなど
      console.error("送信エラー:", error);
      alert("エラーが発生しました。通信環境を確認し、再度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-slate-900 pb-20 font-sans">
      
      {/* ---------------- ヘッダー ---------------- */}
      <header className="bg-white px-4 py-4 shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center">
          <Link href="/about" className="text-stone-500 font-bold hover:bg-stone-100 px-3 py-2 rounded-lg transition">
            ◁ プロフィールへ戻る
          </Link>
          <h1 className="text-xl font-bold ml-auto mr-auto text-slate-800">
            お問い合わせ ✉️
          </h1>
          <div className="w-24"></div>
        </div>
      </header>

      {/* ---------------- メインコンテンツ ---------------- */}
      <main className="max-w-2xl mx-auto px-4 mt-12">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-stone-200 animate-fade-in">
          
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-stone-900 mb-4">Contact</h2>
            <p className="text-stone-600">
              アプリの感想、バグの報告、お仕事のご相談など、<br className="hidden md:block"/>
              お気軽にお問い合わせください。
            </p>
          </div>

          {/* 送信完了メッセージ */}
          {isSuccess ? (
            <div className="bg-green-50 border-2 border-green-200 p-8 rounded-2xl text-center animate-fade-in">
              <span className="text-5xl mb-4 block">🎉</span>
              <h3 className="text-xl font-bold text-green-800 mb-2">メッセージを送信しました！</h3>
              <p className="text-green-700 mb-6">お問い合わせいただき、ありがとうございます。</p>
              <button 
                onClick={() => setIsSuccess(false)}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full transition"
              >
                新しくメッセージを送る
              </button>
            </div>
          ) : (
            /* 入力フォーム */
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <label htmlFor="name" className="block font-bold text-stone-700 mb-2">
                  お名前 <span className="text-red-500 text-sm">*</span>
                </label>
                <input 
                  type="text" 
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-4 border-2 border-stone-200 rounded-xl focus:border-stone-800 focus:outline-none bg-stone-50 transition"
                  placeholder="例：山田 太郎"
                />
              </div>

              <div>
                <label htmlFor="email" className="block font-bold text-stone-700 mb-2">
                  メールアドレス <span className="text-red-500 text-sm">*</span>
                </label>
                <input 
                  type="email" 
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-4 border-2 border-stone-200 rounded-xl focus:border-stone-800 focus:outline-none bg-stone-50 transition"
                  placeholder="例：hello@example.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block font-bold text-stone-700 mb-2">
                  お問い合わせ内容 <span className="text-red-500 text-sm">*</span>
                </label>
                <textarea 
                  id="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-4 border-2 border-stone-200 rounded-xl focus:border-stone-800 focus:outline-none bg-stone-50 transition resize-none"
                  placeholder="ここにメッセージを入力してください..."
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full text-white font-bold py-4 rounded-xl text-lg shadow-md transition transform hover:-translate-y-1 ${
                  isSubmitting ? "bg-stone-400 cursor-not-allowed" : "bg-stone-800 hover:bg-stone-900"
                }`}
              >
                {isSubmitting ? "送信しています..." : "✉️ メッセージを送信する"}
              </button>

            </form>
          )}

        </div>
      </main>
    </div>
  );
}

