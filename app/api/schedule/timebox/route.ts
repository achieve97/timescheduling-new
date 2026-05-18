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

  const items = await prisma.timeBox.findMany({
    where: { scheduleId: schedule.id },
    orderBy: [{ hour: "asc" }, { isFirstHalf: "desc" }],
  });

  const data = items.map((item) => ({
    id: item.id,
    hour: item.hour,
    isFirstHalf: item.isFirstHalf,
    content: decrypt(item.content),
    notes: item.notes ? decrypt(item.notes) : "",
  }));

  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  const user = await getUserFromRequest(req);

  if (!user) {
    return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ message: "요청 형식이 올바르지 않습니다." }, { status: 400 });
  }

  const { date, hour, isFirstHalf, content, notes } = body;

  const parsedDate = parseDate(date);

  if (!parsedDate) {
    return NextResponse.json({ message: "유효한 날짜를 입력해주세요. (YYYY-MM-DD)" }, { status: 400 });
  }

  if (typeof hour !== "number" || hour < 0 || hour > 23) {
    return NextResponse.json({ message: "hour는 0~23 사이의 숫자여야 합니다." }, { status: 400 });
  }

  if (typeof isFirstHalf !== "boolean") {
    return NextResponse.json({ message: "isFirstHalf는 boolean이어야 합니다." }, { status: 400 });
  }

  if (typeof content !== "string") {
    return NextResponse.json({ message: "content는 문자열이어야 합니다." }, { status: 400 });
  }

  const schedule = await getOrCreateSchedule(user.userId, parsedDate);

  if (content.trim() === "") {
    await prisma.timeBox.deleteMany({
      where: { scheduleId: schedule.id, hour, isFirstHalf },
    });
    return new NextResponse(null, { status: 204 });
  }

  const hasNotes = typeof notes === "string";

  const item = await prisma.timeBox.upsert({
    where: { scheduleId_hour_isFirstHalf: { scheduleId: schedule.id, hour, isFirstHalf } },
    update: {
      content: encrypt(content),
      ...(hasNotes ? { notes: encrypt(notes) } : {}),
    },
    create: {
      scheduleId: schedule.id,
      hour,
      isFirstHalf,
      content: encrypt(content),
      notes: hasNotes ? encrypt(notes) : "",
    },
  });

  return NextResponse.json({
    id: item.id,
    hour: item.hour,
    isFirstHalf: item.isFirstHalf,
    content,
    notes: hasNotes ? notes : (item.notes ? decrypt(item.notes) : ""),
  });
}
