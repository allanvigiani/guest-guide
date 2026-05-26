import { neonConfig } from "@neondatabase/serverless"
import { PrismaNeon } from "@prisma/adapter-neon"
import { env } from "@/lib/env"
import ws from "ws"

// PrismaClient is generated to src/generated/prisma/ by `npx prisma generate`
// @ts-expect-error — generated module does not exist until `prisma generate` runs
import { PrismaClient } from "@/generated/prisma"

neonConfig.webSocketConstructor = ws

// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
const createClient = () => new (PrismaClient as any)({
  adapter: new PrismaNeon({ connectionString: env.DATABASE_URL }),
})

type PrismaInstance = ReturnType<typeof createClient>

const globalForPrisma = global as unknown as { prisma: PrismaInstance | undefined }

export const prisma: PrismaInstance =
  globalForPrisma.prisma ?? createClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
