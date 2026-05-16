"use client"; // 操作が必要なので追加

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center font-sans text-slate-900 p-6 pt-20 pb-32">
      <main className="max-w-4xl w-full text-center space-y-10">
        
        {/* ヒーローセクション（タイトル） */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-stone-800 leading-tight">
            日常の些細な出来事に<br />
            <span className="text-blue-600">無駄な彩り</span>を
          </h1>
          <p className="text-stone-600 text-lg md:text-xl max-w-2xl mx-auto">
            AIがあなたの日常を分析し、ユーモアあふれる学術論文や、<br className="hidden md:block" />
            本音を社会性でカバーするメール文などを作成してくれます。
          </p>
        </div>

        {/* モード選択のカード */}
        <div className="grid md:grid-cols-2 gap-6 mt-12 max-w-3xl mx-auto">
          
          {/* ① 大人向け（研究者）モード */}
          <Link 
            href="/create/adult" // 💡 ここを変更！
            className="group block p-8 bg-white border-2 border-amber-200 rounded-2xl hover:border-stone-800 transition-all shadow-sm hover:shadow-lg text-left"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform origin-left">🎓</div>
            <h2 className="text-2xl font-bold mb-2 text-amber-800">日々是論文（研究者モード）</h2>
            <p className="text-stone-500 text-sm leading-relaxed">
              専門用語と難解な語彙を駆使した、大真面目な学術論文を作成します。日常の出来事を無理やりアカデミックに昇華させたい大人向け。
            </p>
          </Link>

          {/* ② 子ども向け（自由研究）モード */}
          <Link 
            href="/create/child" // 💡 ここを変更！
            className="group block p-8 bg-white border-2 border-stone-200 rounded-2xl hover:border-stone-500 transition-all shadow-sm hover:shadow-lg text-left"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform origin-left">🌻</div>
            <h2 className="text-2xl font-bold mb-2 text-stone-700">※開発中<br />日々是論文（自由研究モード）</h2>
            <p className="text-stone-500 text-sm leading-relaxed">
              「どうしてこうなったんだろう？」という視点で、学校に提出できるようなワクワクする研究レポートを作成します。お子様と一緒に楽しむ時に。
            </p>
          </Link>

          {/* 肩の上の秘書*/}
          <Link 
            href="/create/shoulder-secretary" // 💡 ここを変更！
            className="group block p-8 bg-white border-2 border-amber-200 rounded-2xl hover:border-amber-500 transition-all shadow-sm hover:shadow-lg text-left"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform origin-left">🐥</div>
            <h2 className="text-2xl font-bold mb-2 text-amber-700">肩の上の秘書</h2>
            <p className="text-stone-500 text-sm leading-relaxed">
              星新一の『肩の上の秘書』さながらに、悪口や感情的に書いた文章を、相手を不必要に傷つけないように言い換えます。
            </p>
          </Link>

        </div>
      </main>
    </div>
  );
}
{/* トップページのどこかに以下を追加してください（例：一番下） */}
<header className="text-center py-8 mt-10">
  <Link href="/about" className="text-stone-500 hover:text-stone-800 font-bold underline transition">
    制作者について
  </Link>
</header>

