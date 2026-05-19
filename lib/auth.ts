import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export function generateToken(data: Record<string, any>): string {
  return jwt.sign(data, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): Record<string, any> | null {
  try {
    return jwt.verify(token, JWT_SECRET) as Record<string, any>;
  } catch {
    return null;
  }
}

export function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.slice(7);
}

export function getAuthUser(request: NextRequest): Record<string, any> | null {
  const token = extractToken(request);
  if (!token) return null;
  return verifyToken(token);
}
