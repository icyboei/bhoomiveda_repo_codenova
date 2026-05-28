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

    // Dynamic soil health data based on farm profile
    const nitrogenLevel = getNutrientValue(farmProfile?.nitrogen || "Medium");
    const phosphorusLevel = getNutrientValue(farmProfile?.phosphorus || "Medium");
    const potassiumLevel = getNutrientValue(farmProfile?.potassium || "Medium");
    const organicLevel = farmProfile?.soilFertility === "Excellent" ? 88 : farmProfile?.soilFertility === "Good" ? 65 : farmProfile?.soilFertility === "Moderate" ? 40 : 20;

    const soilData = [
      { name: "Nitrogen", value: nitrogenLevel, color: "#2E7D32" },
      { name: "Phosphorus", value: phosphorusLevel, color: "#81C784" },
      { name: "Potassium", value: potassiumLevel, color: "#FBC02D" },
      { name: "Organic", value: organicLevel, color: "#8D6E63" },
    ];

    const overallScore = Math.round((nitrogenLevel + phosphorusLevel + potassiumLevel + organicLevel) / 4);
    const grade = overallScore >= 80 ? "Excellent" : overallScore >= 60 ? "Good" : overallScore >= 40 ? "Moderate" : "Poor";

    return NextResponse.json({
      success: true,
      soil: {
        data: soilData,
        overallScore,
        grade,
        ph: farmProfile?.ph || 6.5,
        soilType: farmProfile?.soilType || "Black Soil (Regur / Black Cotton)",
        fertility: farmProfile?.soilFertility || "Good",
        advice: getSoilAdvice(farmProfile),
      },
    });
  } catch (error) {
    console.error("[Soil Error]", error);
    return NextResponse.json({ error: "Failed to get soil data" }, { status: 500 });
  }
}

function getNutrientValue(level: string): number {
  switch (level) {
    case "Very High": return 95;
    case "High": return 80;
    case "Medium": return 60;
    case "Low": return 35;
    case "Very Low": return 15;
    default: return 60;
  }
}

function getSoilAdvice(farm: any): string[] {
  const advice: string[] = [];
  if (!farm) {
    advice.push("Complete your farm profile to get personalized soil advice.");
    return advice;
  }

  if (farm.nitrogen === "Very Low" || farm.nitrogen === "Low") {
    advice.push("Apply 20kg nitrogen fertilizer before next irrigation");
  }
  if (farm.phosphorus === "Very Low" || farm.phosphorus === "Low") {
    advice.push("Add DAP/SSP at basal stage to boost phosphorus levels");
  }
  if (farm.potassium === "Very Low" || farm.potassium === "Low") {
    advice.push("Add MOP to improve grain filling and stress tolerance");
  }
  if (farm.soilFertility === "Poor") {
    advice.push("Add FYM/compost (5-10 t/ha) and green manure before sowing");
  }
  if (advice.length === 0) {
    advice.push("Soil health is good. Maintain with balanced fertilization.");
  }

  return advice;
}
