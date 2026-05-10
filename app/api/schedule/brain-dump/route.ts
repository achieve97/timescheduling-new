import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { encrypt, decrypt } from "@/lib/crypto";
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

  const items = await prisma.brainDump.findMany({
    where: { scheduleId: schedule.id },
    orderBy: { createdAt: "asc" },
  });

  const data = items.map((item) => ({
    id: item.id,
    content: decrypt(item.content),
  }));

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);

  if (!user) {
    return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ message: "요청 형식이 올바르지 않습니다." }, { status: 400 });
  }

  const { date, content } = body;

  if (!date) {
    return NextResponse.json({ message: "날짜를 입력해주세요." }, { status: 400 });
  }

  const parsedDate = parseDate(date);

  if (!parsedDate) {
    return NextResponse.json({ message: "유효한 날짜를 입력해주세요. (YYYY-MM-DD)" }, { status: 400 });
  }

  if (typeof content !== "string" || content.trim() === "") {
    return NextResponse.json({ message: "내용을 입력해주세요." }, { status: 400 });
  }

  const schedule = await getOrCreateSchedule(user.userId, parsedDate);

  const item = await prisma.brainDump.create({
    data: { scheduleId: schedule.id, content: encrypt(content) },
  });

  return NextResponse.json({ id: item.id, content }, { status: 201 });
}
