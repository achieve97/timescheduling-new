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

  if (!body) {
    return NextResponse.json({ message: "요청 형식이 올바르지 않습니다." }, { status: 400 });
  }

  const existing = await prisma.bigThree.findFirst({
    where: { id: itemId, schedule: { userId: user.userId } },
  });

  if (!existing) {
    return NextResponse.json({ message: "항목을 찾을 수 없습니다." }, { status: 404 });
  }

  const updateData: { content?: string; completed?: boolean } = {};

  if (typeof body.content === "string") {
    updateData.content = encrypt(body.content);
  }

  if (typeof body.completed === "boolean") {
    updateData.completed = body.completed;
  }

  const updated = await prisma.bigThree.update({
    where: { id: itemId },
    data: updateData,
  });

  return NextResponse.json({
    id: updated.id,
    order: updated.order,
    content: decrypt(updated.content),
    completed: updated.completed,
  });
}
