// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

// 💡 ここで default export を行うことで、page.tsx のエラーが消えます
export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;