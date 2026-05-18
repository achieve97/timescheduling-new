import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/crypto";
import { getUserFromRequest } from "@/lib/session";
import { getOrCreateSchedule, parseDate } from "@/lib/schedule";

export async function PATCH(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!Array.isArray(body)) return NextResponse.json({ message: "요청 형식이 올바르지 않습니다." }, { status: 400 });

  const items: { id: number; order: number }[] = body;

  await prisma.$transaction(async (tx) => {
    await Promise.all(
      items.map(({ id }) =>
        tx.bigThree.updateMany({
          where: { id, schedule: { userId: user.userId } },
          data: { order: id + 10000 },
        })
      )
    );
    await Promise.all(
      items.map(({ id, order }) =>
        tx.bigThree.updateMany({
          where: { id, schedule: { userId: user.userId } },
          data: { order },
        })
      )
    );
  });

  return NextResponse.json({ ok: true });
}

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
