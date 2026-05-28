import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { mobile, otp, purpose } = await req.json();
    const purp = purpose || "auth";

    if (!mobile || !otp) {
      return NextResponse.json(
        { error: "Mobile number and OTP are required." },
        { status: 400 }
      );
    }

    // Find the most recent unverified OTP for this mobile
    const otpRecord = await db.otp.findFirst({
      where: {
        mobile: mobile.trim(),
        code: otp.trim(),
        purpose: purp,
        verified: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { error: "Invalid or expired OTP. Please try again." },
        { status: 400 }
      );
    }

    // Mark OTP as verified
    await db.otp.update({
      where: { id: otpRecord.id },
      data: { verified: true },
    });

    return NextResponse.json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("[Verify OTP Error]", error);
    return NextResponse.json(
      { error: "Failed to verify OTP. Please try again." },
      { status: 500 }
    );
  }
}
