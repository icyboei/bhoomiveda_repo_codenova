import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const farmProfile = await db.farmProfile.findUnique({
      where: { userId: user.id },
    });

    const activeCrops = farmProfile?.currentCrop || "Wheat";
    const landSize = farmProfile?.landSize || 5;
    const soilScore = 78; // Based on soil analysis algorithm

    const stats = {
      activeCrops,
      totalAcres: landSize,
      soilScore,
      soilGrade: soilScore >= 80 ? "Excellent" : soilScore >= 60 ? "Good" : soilScore >= 40 ? "Moderate" : "Poor",
      trend: {
        crops: 12,
        soil: 5,
      },
      season: getCurrentSeason(),
    };

    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error("[Stats Error]", error);
    return NextResponse.json({ error: "Failed to get stats" }, { status: 500 });
  }
}

function getCurrentSeason(): string {
  const m = new Date().getMonth() + 1;
  if (m >= 6 && m <= 10) return "Kharif (Jun-Oct)";
  if (m >= 11 || m <= 3) return "Rabi (Nov-Mar)";
  return "Zaid (Mar-Jun)";
}
