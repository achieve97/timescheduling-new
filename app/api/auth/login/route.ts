import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ message: "요청 형식이 올바르지 않습니다." }, { status: 400 });
  }

  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ message: "이메일과 비밀번호를 입력해주세요." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." }, { status: 401 });
  }

  const valid = await comparePassword(password, user.password);

  if (!valid) {
    return NextResponse.json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." }, { status: 401 });
  }

  const token = await signToken({ userId: user.id, email: user.email });

  return NextResponse.json({ token });
}
