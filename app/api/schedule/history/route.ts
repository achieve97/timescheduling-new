import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/crypto";
import { getUserFromRequest } from "@/lib/session";

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });

  const schedules = await prisma.dailySchedule.findMany({
    where: { userId: user.userId },
    include: {
      bigThrees: { select: { content: true, completed: true } },
      _count: { select: { timeBoxes: true } },
    },
    orderBy: { date: "desc" },
  });

  const data = schedules
    .map((s) => {
      const big3 = s.bigThrees.map((b) => ({
        content: decrypt(b.content),
        completed: b.completed,
      }));
      const filled = big3.filter((b) => b.content.trim());
      return {
        date: s.date.toISOString().split("T")[0],
        bigThreeTotal: filled.length,
        bigThreeCompleted: filled.filter((b) => b.completed).length,
        timeBoxCount: s._count.timeBoxes,
      };
    })
    .filter((d) => d.bigThreeTotal > 0 || d.timeBoxCount > 0);

  return NextResponse.json(data);
}
