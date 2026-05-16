import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
// 💡 lib/prisma.ts で default export された prisma を読み込む
import prisma from "@/lib/prisma";

type Paper = {
  id: string;
  title: string;
  mode: string;
  createdAt: Date;
};

export default async function MyPage() {
  const user = await currentUser();
  if (!user) redirect("/");

  // 💡 データベースから「このユーザーの論文」を最新順（desc）で取得
  const papers: Paper[] = await prisma.paper.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-stone-50 text-slate-900 pb-20 pt-10 font-sans">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 border-b-2 border-stone-800 pb-2">
          👤 研究者ダッシュボード
        </h1>
        
        {/* プロフィール */}
        <div className="bg-white p-6 border border-stone-300 shadow-sm rounded-lg mb-8 flex items-center gap-6">
          <img src={user.imageUrl} alt="Profile" className="w-20 h-20 rounded-full shadow-sm" />
          <div>
            <p className="font-bold text-2xl">{user.firstName} {user.lastName}</p>
            <p className="text-stone-500 mt-1">{user.emailAddresses[0].emailAddress}</p>
          </div>
        </div>

        {/* 過去の論文リスト */}
        <div className="bg-white p-6 border border-stone-300 shadow-sm rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">📚 過去に執筆した論文</h2>
            <Link href="/create?mode=adult" className="bg-stone-800 hover:bg-stone-900 text-white px-4 py-2 rounded font-bold text-sm transition">
              ＋ 新規作成
            </Link>
          </div>
          
          {papers.length === 0 ? (
            <div className="bg-stone-100 p-8 text-center rounded border border-dashed border-stone-300">
              <p className="text-stone-500 font-bold">まだ論文がありません</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {papers.map((paper: Paper) => (
                <li key={paper.id} className="p-4 border rounded-md hover:bg-stone-50 transition">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs font-bold px-2 py-1 bg-stone-200 rounded mr-2">
                        {paper.mode === 'child' ? '🌻 自由研究' : '🎓 研究者'}
                      </span>
                      <strong className="text-lg">{paper.title}</strong>
                    </div>
                    <span className="text-sm text-stone-500">
                      {paper.createdAt.toLocaleDateString("ja-JP")}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}