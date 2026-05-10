import { NextRequest } from "next/server";
import { verifyToken } from "./auth";

export async function getUserFromRequest(req: NextRequest) {
  const authorization = req.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) return null;

  const token = authorization.slice(7);

  try {
    return await verifyToken(token);
  } catch {
    return null;
  }
}
