import { PrismaClient } from "@prisma/client";

export const db=globalThis.prisma || new PrismaClient
// nextjs does hot reload, so to avoid new creation eevrytime we check for global one existing 
// otherwise connection issue may be faced 

if (process.env.NODE_ENV !=="production")
{
    globalThis.prisma=db;
}