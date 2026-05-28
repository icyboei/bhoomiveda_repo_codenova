import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Market price data - in production this would come from an agricultural market API
    const market = {
      prices: [
        { month: "Jan", wheat: 2100, rice: 3200, soybean: 4100 },
        { month: "Feb", wheat: 2300, rice: 3100, soybean: 4300 },
        { month: "Mar", wheat: 2200, rice: 3400, soybean: 4000 },
        { month: "Apr", wheat: 2600, rice: 3300, soybean: 4500 },
        { month: "May", wheat: 2800, rice: 3600, soybean: 4200 },
        { month: "Jun", wheat: 2500, rice: 3800, soybean: 4800 },
        { month: "Jul", wheat: 2900, rice: 4000, soybean: 4600 },
      ],
      profit: [
        { crop: "Wheat", profit: 18000, cost: 8000 },
        { crop: "Rice", profit: 22000, cost: 11000 },
        { crop: "Soybean", profit: 31000, cost: 14000 },
        { crop: "Maize", profit: 15000, cost: 7000 },
      ],
      aiRecommendations: [
        {
          crop: "Soybean JS-335", icon: "🫘", color: "#2E7D32", water: "Low", risk: "Low", confidence: 94,
          hybrid: false, investment: 12500, investmentBreakdown: { Seeds: 2800, Fertilizer: 4200, Labour: 3000, Irrigation: 1500, Other: 1000 },
          yieldPerAcre: 12, yieldUnit: "quintals", marketPrice: 4600, marketTrend: "up", marketChange: 8,
          grossRevenue: 55200, profit: 42700, successRate: 91, successNote: "High success in Black Cotton soil with moderate rainfall",
        },
        {
          crop: "Wheat GW-496 (Sharbati)", icon: "🌾", color: "#FBC02D", water: "Medium", risk: "Low", confidence: 88,
          hybrid: false, investment: 10800, investmentBreakdown: { Seeds: 2200, Fertilizer: 3800, Labour: 2800, Irrigation: 1200, Other: 800 },
          yieldPerAcre: 18, yieldUnit: "quintals", marketPrice: 2275, marketTrend: "stable", marketChange: 2,
          grossRevenue: 40950, profit: 30150, successRate: 85, successNote: "Reliable Rabi crop; MSP guaranteed at ₹2275/quintal",
        },
        {
          crop: "Maize DKC-9144 (Hybrid)", icon: "🌽", color: "#FF8F00", water: "Medium", risk: "Medium", confidence: 76,
          hybrid: true, investment: 9200, investmentBreakdown: { Seeds: 3400, Fertilizer: 3000, Labour: 1800, Irrigation: 700, Other: 300 },
          yieldPerAcre: 22, yieldUnit: "quintals", marketPrice: 1850, marketTrend: "up", marketChange: 5,
          grossRevenue: 40700, profit: 31500, successRate: 74, successNote: "High-yield hybrid; requires consistent moisture in early stage",
        },
      ],
      cropInputAdvice: {
        Soybean: {
          fertilizers: ["Rhizobium culture seed treatment", "Single Super Phosphate (SSP)", "Sulphur 20-25 kg/ha"],
          pesticides: ["Thiamethoxam (for stem fly/whitefly)", "Neem oil spray 3 ml/L (early stage)", "Emamectin benzoate (for girdle beetle/caterpillars)"],
        },
        Wheat: {
          fertilizers: ["Urea split dose (basal + CRI stage)", "DAP at sowing", "MOP for potash-deficient soils"],
          pesticides: ["Pendimethalin pre-emergence (weed control)", "Propiconazole/Tebuconazole (rust management)", "Imidacloprid (aphids if ETL crossed)"],
        },
        Maize: {
          fertilizers: ["NPK 120:60:40 kg/ha (crop-stage split)", "Zinc sulphate in zinc-deficient soils", "Farmyard manure 5-10 t/ha"],
          pesticides: ["Chlorantraniliprole (fall armyworm)", "Spinosad for early larvae", "Atrazine pre-emergence (weed control)"],
        },
      },
    };

    return NextResponse.json({ success: true, market });
  } catch (error) {
    console.error("[Market Error]", error);
    return NextResponse.json({ error: "Failed to get market data" }, { status: 500 });
  }
}
