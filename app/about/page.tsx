import Link from "next/link";

export default function AboutMe() {
  return (
    <div className="min-h-screen bg-stone-50 text-slate-900 pb-20 font-sans">
      
      {/* ---------------- ヘッダー ---------------- */}
      <header className="bg-white px-4 py-4 shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center">
          <Link href="/" className="text-stone-500 font-bold hover:bg-stone-100 px-3 py-2 rounded-lg transition">
            ◁ もどる
          </Link>
          <h1 className="text-xl font-bold ml-auto mr-auto text-slate-800">
            制作者について 👨‍💻
          </h1>
          <div className="w-16"></div> {/* レイアウト調整用 */}
        </div>
      </header>

      {/* ---------------- メインコンテンツ ---------------- */}
      <main className="max-w-3xl mx-auto px-4 mt-12">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-stone-200 animate-fade-in">
          
          {/* プロフィール上部（顔写真と名前） */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-12 border-b border-stone-100 pb-10">
            {/* 💡 後で実際のアイコン画像に差し替えてください */}
            <div className="w-32 h-32 bg-stone-200 rounded-full overflow-hidden flex-shrink-0 shadow-inner flex items-center justify-center text-5xl">
              👤
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold mb-2 text-stone-900">阿里山</h2>
              <p className="text-stone-500 text-lg font-medium">Webエンジニア / クリエイター</p>
            </div>
          </div>

          {/* 自己紹介セクション */}
          <div className="space-y-10 text-stone-700 leading-relaxed">
            <section>
              <h3 className="text-xl font-bold border-l-4 border-stone-800 pl-3 mb-4 text-stone-900">
                自己紹介
              </h3>
              <p>
                こんにちは！この「おゆとりさま」を開発した阿里山です。<br />
                独学でプログラミングを勉強しながら、「日常をちょっと楽しくするWebアプリ」の制作に取り組んでいます。
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold border-l-4 border-stone-800 pl-3 mb-4 text-stone-900">
                趣味
              </h3>
              <p>
                ・ランニング<br />
                ・コーヒー焙煎<br />
                ・居酒屋巡り<br />
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold border-l-4 border-stone-800 pl-3 mb-4 text-stone-900">
                このアプリを作った理由
              </h3>
              <p>
                もともと一般的に「無駄」とされることや、「こんなことして何になる」と言われることを楽しむ人間でしたので、<br />
                これをAIの力を使って一般化できたらと思い、気まぐれで作成しました。
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold border-l-4 border-stone-800 pl-3 mb-4 text-stone-900">
                技術スタック (使っている技術)
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>フロントエンド:</strong> Next.js, Tailwind CSS</li>
                <li><strong>バックエンド:</strong> Supabase, Prisma</li>

              </ul>
            </section>

            <section>
              <h3 className="text-xl font-bold border-l-4 border-stone-800 pl-3 mb-4 text-stone-900">
                リンク
              </h3>
              <ul className="flex gap-6">
                <li>
                  <a href="https://github.com/Alishanscafe" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-bold underline transition">
                    GitHub
                  </a>
                </li>

                <li>
                  <a href="https://note.com/fragile_3110" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-bold underline transition">
                    note
                  </a>
                </li>
              </ul>
            </section>
          </div>

        </div>
      </main>
    </div>
  );
}

