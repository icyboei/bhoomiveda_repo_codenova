import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateOtp, cleanupExpiredOtps } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await cleanupExpiredOtps();

    const { mobile, purpose } = await req.json();
    const purp = purpose || "login";

    // Validate mobile number
    if (!mobile || !/^[6-9]\d{9}$/.test(mobile.trim())) {
      return NextResponse.json(
        { error: "Invalid mobile number. Must be 10 digits starting with 6-9." },
        { status: 400 }
      );
    }

    // For signup, check if user already exists
    if (purp === "signup") {
      const existingUser = await db.user.findUnique({ where: { mobile } });
      if (existingUser) {
        return NextResponse.json(
          { error: "An account with this mobile number already exists. Please login instead." },
          { status: 409 }
        );
      }
    }

    // For login, check if user exists
    if (purp === "login") {
      const existingUser = await db.user.findUnique({ where: { mobile } });
      if (!existingUser) {
        return NextResponse.json(
          { error: "No account found with this mobile number. Please signup first." },
          { status: 404 }
        );
      }
    }

    // Generate OTP
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Store OTP in database
    await db.otp.create({
      data: {
        mobile: mobile.trim(),
        code: otp,
        expiresAt,
        purpose: purp,
      },
    });

    // In production, you would send OTP via SMS gateway (e.g., Twilio, MSG91)
    // For demonstration, we return the OTP in the response so it can be tested
    console.log(`[OTP] Mobile: ${mobile}, OTP: ${otp}, Purpose: ${purp}`);

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
      // For demo purposes, we include the OTP. In production, remove this.
      otp,
      expiresIn: 300,
    });
  } catch (error) {
    console.error("[Send OTP Error]", error);
    return NextResponse.json(
      { error: "Failed to send OTP. Please try again." },
      { status: 500 }
    );
  }
}
