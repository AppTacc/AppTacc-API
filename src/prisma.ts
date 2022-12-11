import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
	log: process.env.environment === "development" ? ["query"] : []
});
