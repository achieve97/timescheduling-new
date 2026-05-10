import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { encrypt, decrypt } from "@/lib/crypto";
import { getUserFromRequest } from "@/lib/session";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUserFromRequest(req);

  if (!user) {
    return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });
  }

  const { id } = await params;
  const itemId = parseInt(id);

  if (isNaN(itemId)) {
    return NextResponse.json({ message: "잘못된 ID입니다." }, { status: 400 });
  }

  const body = await req.json().catch(() => null);

  if (!body || typeof body.content !== "string" || body.content.trim() === "") {
    return NextResponse.json({ message: "내용을 입력해주세요." }, { status: 400 });
  }

  const existing = await prisma.brainDump.findFirst({
    where: { id: itemId, schedule: { userId: user.userId } },
  });

  if (!existing) {
    return NextResponse.json({ message: "항목을 찾을 수 없습니다." }, { status: 404 });
  }

  const updated = await prisma.brainDump.update({
    where: { id: itemId },
    data: { content: encrypt(body.content) },
  });

  return NextResponse.json({ id: updated.id, content: decrypt(updated.content) });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUserFromRequest(req);

  if (!user) {
    return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });
  }

  const { id } = await params;
  const itemId = parseInt(id);

  if (isNaN(itemId)) {
    return NextResponse.json({ message: "잘못된 ID입니다." }, { status: 400 });
  }

  const existing = await prisma.brainDump.findFirst({
    where: { id: itemId, schedule: { userId: user.userId } },
  });

  if (!existing) {
    return NextResponse.json({ message: "항목을 찾을 수 없습니다." }, { status: 404 });
  }

  await prisma.brainDump.delete({ where: { id: itemId } });

  return new NextResponse(null, { status: 204 });
}
