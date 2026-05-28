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

    const location = farmProfile?.district || farmProfile?.state || "Bhopal, MP";

    // Weather data - in production this would come from a weather API
    // For demo purposes, we return realistic mock data based on season
    const month = new Date().getMonth();
    const isSummer = month >= 3 && month <= 5;
    const isWinter = month >= 10 || month <= 2;
    const isMonsoon = month >= 6 && month <= 9;

    const weather = {
      location,
      current: {
        temp: isSummer ? 38 + Math.round(Math.random() * 5) : isWinter ? 18 + Math.round(Math.random() * 8) : 28 + Math.round(Math.random() * 5),
        humidity: isMonsoon ? 75 + Math.round(Math.random() * 15) : isSummer ? 25 + Math.round(Math.random() * 15) : 45 + Math.round(Math.random() * 20),
        description: isMonsoon ? "Rainy" : isSummer ? "Partly Sunny" : isWinter ? "Clear" : "Partly Cloudy",
        windSpeed: isMonsoon ? 18 + Math.round(Math.random() * 12) : 8 + Math.round(Math.random() * 8),
        rainChance: isMonsoon ? 70 + Math.round(Math.random() * 25) : 10 + Math.round(Math.random() * 15),
      },
      forecast: [
        { day: "Mon", temp: isSummer ? 37 : isWinter ? 17 : 26, icon: isMonsoon ? "🌧️" : "⛅" },
        { day: "Tue", temp: isSummer ? 39 : isWinter ? 19 : 28, icon: isMonsoon ? "🌧️" : "☀️" },
        { day: "Wed", temp: isSummer ? 36 : isWinter ? 16 : 25, icon: isMonsoon ? "🌧️" : "☁️" },
        { day: "Thu", temp: isSummer ? 38 : isWinter ? 18 : 27, icon: isMonsoon ? "⛅" : "☀️" },
        { day: "Fri", temp: isSummer ? 37 : isWinter ? 20 : 29, icon: isMonsoon ? "☀️" : "⛅" },
      ],
      soilReport: getSoilReport(farmProfile),
    };

    return NextResponse.json({ success: true, weather });
  } catch (error) {
    console.error("[Weather Error]", error);
    return NextResponse.json({ error: "Failed to get weather" }, { status: 500 });
  }
}

function getSoilReport(farm: any): string[] {
  const report: string[] = [];
  if (!farm) {
    report.push("Complete your farm profile to get a soil report.");
    return report;
  }

  if (farm.ph < 6) report.push("Soil is acidic: apply agricultural lime based on soil-test dose.");
  if (farm.ph > 7.8) report.push("Soil is alkaline: prefer gypsum and more organic manure.");
  if (farm.soilFertility === "Poor") report.push("Soil fertility is poor: add FYM/compost and green manure before sowing.");
  if (farm.soilFertility === "Moderate") report.push("Soil fertility is moderate: combine compost with balanced NPK application.");
  if (farm.nitrogen === "Very Low" || farm.nitrogen === "Low") report.push("Nitrogen is low: apply urea in split doses.");
  if (farm.phosphorus === "Very Low" || farm.phosphorus === "Low") report.push("Phosphorus is low: add DAP/SSP at basal stage.");
  if (farm.potassium === "Very Low" || farm.potassium === "Low") report.push("Potassium is low: add MOP to improve grain filling and stress tolerance.");
  if (report.length === 0) report.push("Soil profile looks balanced for the selected crop season.");

  return report;
}
