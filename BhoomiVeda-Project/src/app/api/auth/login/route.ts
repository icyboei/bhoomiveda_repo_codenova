import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { mobile, otp } = await req.json();

    if (!mobile || !otp) {
      return NextResponse.json(
        { error: "Mobile and OTP are required." },
        { status: 400 }
      );
    }

    // Find user by mobile
    const user = await db.user.findUnique({ where: { mobile: mobile.trim() } });
    if (!user) {
      return NextResponse.json(
        { error: "No account found with this mobile number." },
        { status: 404 }
      );
    }

    // Verify OTP was verified
    const otpRecord = await db.otp.findFirst({
      where: {
        mobile: mobile.trim(),
        code: otp.trim(),
        purpose: "login",
        verified: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { error: "OTP not verified. Please verify your OTP first." },
        { status: 400 }
      );
    }

    // Create session
    const token = await createSession(user.id);

    const response = NextResponse.json({
      success: true,
      message: "Login successful!",
      user: {
        id: user.id,
        mobile: user.mobile,
        name: user.name,
        role: user.role,
      },
    });

    // Set session cookie
    response.cookies.set("session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[Login Error]", error);
    return NextResponse.json(
      { error: "Failed to login. Please try again." },
      { status: 500 }
    );
  }
}
