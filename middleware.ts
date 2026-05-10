import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

const PROTECTED = /^\/api\/schedule/;

export async function middleware(req: NextRequest) {
  if (!PROTECTED.test(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const authorization = req.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });
  }

  const token = authorization.slice(7);

  try {
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    return NextResponse.json({ message: "토큰이 유효하지 않습니다." }, { status: 401 });
  }
}

export const config = {
  matcher: ["/api/schedule/:path*"],
};
