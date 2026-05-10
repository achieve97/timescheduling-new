import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/crypto";
import { getUserFromRequest } from "@/lib/session";
import { getOrCreateSchedule, parseDate } from "@/lib/schedule";

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);

  if (!user) {
    return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });
  }

  const date = parseDate(req.nextUrl.searchParams.get("date"));

  if (!date) {
    return NextResponse.json({ message: "유효한 날짜를 입력해주세요. (YYYY-MM-DD)" }, { status: 400 });
  }

  const schedule = await getOrCreateSchedule(user.userId, date);

  const items = await prisma.bigThree.findMany({
    where: { scheduleId: schedule.id },
    orderBy: { order: "asc" },
  });

  const data = items.map((item) => ({
    id: item.id,
    order: item.order,
    content: decrypt(item.content),
    completed: item.completed,
  }));

  return NextResponse.json(data);
}
