import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { mobile, name, role, otp } = await req.json();

    // Validate required fields
    if (!mobile || !name || !otp) {
      return NextResponse.json(
        { error: "Mobile, name, and OTP are required." },
        { status: 400 }
      );
    }

    if (!/^[6-9]\d{9}$/.test(mobile.trim())) {
      return NextResponse.json(
        { error: "Invalid mobile number." },
        { status: 400 }
      );
    }

    if (name.trim().length < 2) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters." },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({ where: { mobile: mobile.trim() } });
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this mobile number already exists." },
        { status: 409 }
      );
    }

    // Verify OTP was verified
    const otpRecord = await db.otp.findFirst({
      where: {
        mobile: mobile.trim(),
        code: otp.trim(),
        purpose: "signup",
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

    // Create user
    const user = await db.user.create({
      data: {
        mobile: mobile.trim(),
        name: name.trim(),
        role: role || "farmer",
      },
    });

    // Create default farm profile
    await db.farmProfile.create({
      data: { userId: user.id },
    });

    // Seed some initial activities and notifications
    await db.activity.createMany({
      data: [
        { userId: user.id, icon: "🎉", text: "Welcome to BhoomiVeda! Your account has been created.", type: "system" },
        { icon: "🌱", text: "Complete your farm profile to get personalized AI recommendations.", type: "ai" },
      ],
    });

    await db.notification.createMany({
      data: [
        { userId: user.id, title: "Welcome!", desc: "Start by setting up your farm profile for personalized recommendations.", type: "info" },
        { userId: user.id, title: "Quick Tip", desc: "Add your soil details to get accurate crop recommendations from AI.", type: "ai" },
      ],
    });

    // Create session
    const token = await createSession(user.id);

    const response = NextResponse.json({
      success: true,
      message: "Account created successfully!",
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
    console.error("[Signup Error]", error);
    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
}
