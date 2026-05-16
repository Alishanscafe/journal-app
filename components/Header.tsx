"use client";

import Link from "next/link";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";

export default function Header() {
  const { isSignedIn, isLoaded } = useUser();

  // 読み込み中は何も表示しない
  if (!isLoaded) return null;

  return (
    <header className="bg-stone-900 text-white py-4 px-6 flex justify-between items-center font-sans shadow-md">
      
      {/* 左：ロゴ */}
      <Link
        href="/"
        className="text-xl font-bold hover:text-stone-300 transition"
      >
        おゆとりさま
      </Link>

      {/* 右：ナビ */}
      <nav className="flex items-center gap-4">
        <Link
          href="/about"
          className="text-stone-300 hover:text-white font-bold underline transition"
        >
          制作者について
        </Link>

        <Link
          href="/create"
          className="text-stone-300 hover:text-white font-bold underline transition"
        >
          問い合わせ
        </Link>

        {!isSignedIn ? (
          <SignInButton mode="modal">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-bold transition shadow-sm">
              ログイン / 新規登録
            </button>
          </SignInButton>
        ) : (
          <>
            <Link
              href="/mypage"
              className="text-stone-300 hover:text-white font-bold transition"
            >
              👤 マイページ
            </Link>
            <UserButton />
          </>
        )}
      </nav>
    </header>
  );
}