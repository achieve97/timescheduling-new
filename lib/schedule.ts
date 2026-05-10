import { prisma } from "./prisma";
import { encrypt } from "./crypto";

export function parseDate(dateStr: string | null): Date | null {
  if (!dateStr) return null;
  const d = new Date(dateStr + "T00:00:00.000Z");
  return isNaN(d.getTime()) ? null : d;
}

export async function getOrCreateSchedule(userId: number, date: Date) {
  const existing = await prisma.dailySchedule.findUnique({
    where: { userId_date: { userId, date } },
  });

  if (existing) return existing;

  const empty = encrypt("");

  return prisma.dailySchedule.create({
    data: {
      userId,
      date,
      bigThrees: {
        create: [
          { content: empty, order: 1 },
          { content: empty, order: 2 },
          { content: empty, order: 3 },
        ],
      },
    },
  });
}
