import { db } from "@/lib/db";
import { cookies } from "next/headers";
import crypto from "crypto";

// Generate a 6-digit OTP
export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Generate a secure session token
export function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// Get current user from session token in cookies
export async function getCurrentUser(): Promise<{ id: string; mobile: string; name: string; role: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return null;

  const session = await db.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    return null;
  }

  return {
    id: session.user.id,
    mobile: session.user.mobile,
    name: session.user.name,
    role: session.user.role,
  };
}

// Create a session for a user
export async function createSession(userId: string): Promise<string> {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  await db.session.create({
    data: { userId, token, expiresAt },
  });

  return token;
}

// Delete a session (logout)
export async function deleteSession(token: string): Promise<void> {
  await db.session.deleteMany({ where: { token } });
}

// Clean up expired OTPs
export async function cleanupExpiredOtps(): Promise<void> {
  await db.otp.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
}
