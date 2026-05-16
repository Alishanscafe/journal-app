import { clerkMiddleware } from "@clerk/nextjs/server";

// 💡 基本的なClerkのミドルウェア設定
export default clerkMiddleware();

export const config = {
  // 💡 監視するURLのルール（Next.jsの内部ファイルや静的ファイルは除外する設定）
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
