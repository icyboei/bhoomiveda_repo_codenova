import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const formData = await req.json();

    // Update farm profile with submitted data
    await db.farmProfile.upsert({
      where: { userId: user.id },
      update: {
        state: formData.state,
        district: formData.district,
        village: formData.village,
        pinCode: formData.pinCode,
        soilType: formData.soil,
        ph: parseFloat(formData.ph) || 6.5,
        soilFertility: formData.soilFertility,
        nitrogen: formData.nitrogen,
        phosphorus: formData.phosphorus,
        potassium: formData.potassium,
        landSize: parseFloat(formData.land) || 5,
        landUnit: formData.landUnit,
        irrigation: formData.irrigation,
        currentCrop: formData.currentCrop,
        prevCrop: formData.prevCrop,
        budget: parseFloat(formData.budget) || 75000,
        labourCost: parseFloat(formData.labourCost) || 18000,
        sellingPreference: formData.sellingPreference,
      },
      create: {
        userId: user.id,
        state: formData.state,
        district: formData.district,
        village: formData.village,
        pinCode: formData.pinCode,
        soilType: formData.soil,
        ph: parseFloat(formData.ph) || 6.5,
        soilFertility: formData.soilFertility,
        nitrogen: formData.nitrogen,
        phosphorus: formData.phosphorus,
        potassium: formData.potassium,
        landSize: parseFloat(formData.land) || 5,
        landUnit: formData.landUnit,
        irrigation: formData.irrigation,
        currentCrop: formData.currentCrop,
        prevCrop: formData.prevCrop,
        budget: parseFloat(formData.budget) || 75000,
        labourCost: parseFloat(formData.labourCost) || 18000,
        sellingPreference: formData.sellingPreference,
      },
    });

    // Generate AI crop recommendations based on farm data
    const recommendations = generateRecommendations(formData);

    // Log activity
    await db.activity.create({
      data: {
        userId: user.id,
        icon: "🤖",
        text: `AI generated ${recommendations.length} crop recommendations based on your farm profile`,
        type: "ai",
      },
    });

    await db.notification.create({
      data: {
        userId: user.id,
        title: "New AI Recommendations",
        desc: `${recommendations.length} crops recommended based on your farm conditions.`,
        type: "ai",
      },
    });

    return NextResponse.json({
      success: true,
      recommendations,
      message: `AI analysis complete. ${recommendations.length} crops recommended.`,
    });
  } catch (error) {
    console.error("[AI Crop Error]", error);
    return NextResponse.json({ error: "Failed to get crop recommendations" }, { status: 500 });
  }
}

function generateRecommendations(data: any): any[] {
  const recommendations: any[] = [];
  const season = data.season || detectSeason();
  const soil = data.soil || "Black Soil (Regur / Black Cotton)";
  const rainfall = parseInt(data.rainfall) || 850;
  const budget = parseFloat(data.budget) || 75000;
  const irrigation = data.irrigation || "Borewell";
  const prevCrop = data.prevCrop || "Soybean";

  // Kharif recommendations
  if (season.includes("Kharif")) {
    if (soil.includes("Black") && rainfall >= 600) {
      recommendations.push({
        crop: "Soybean JS-335", icon: "🫘", color: "#2E7D32", water: "Low", risk: "Low", confidence: 94,
        hybrid: false, investment: 12500, investmentBreakdown: { Seeds: 2800, Fertilizer: 4200, Labour: 3000, Irrigation: 1500, Other: 1000 },
        yieldPerAcre: 12, yieldUnit: "quintals", marketPrice: 4600, marketTrend: "up", marketChange: 8,
        grossRevenue: 55200, profit: 42700, successRate: 91, successNote: "High success in Black Cotton soil with moderate rainfall",
        advice: { fertilizers: ["Rhizobium culture seed treatment", "Single Super Phosphate (SSP)"], pesticides: ["Thiamethoxam (stem fly)", "Neem oil spray"] },
      });
    }
    if (soil.includes("Black") || soil.includes("Alluvial")) {
      recommendations.push({
        crop: "Cotton NH-615", icon: "🏮", color: "#F5F5DC", water: "Medium", risk: "Low", confidence: 82,
        hybrid: true, investment: 18500, investmentBreakdown: { Seeds: 5200, Fertilizer: 5000, Labour: 4500, Irrigation: 2500, Other: 1300 },
        yieldPerAcre: 8, yieldUnit: "quintals", marketPrice: 7200, marketTrend: "up", marketChange: 5,
        grossRevenue: 57600, profit: 39100, successRate: 78, successNote: "Good for Black Cotton soil with adequate irrigation",
        advice: { fertilizers: ["NPK 18:46:0 at sowing", "Urea 46:0:0 top dressing"], pesticides: ["Imidacloprid (sucking pests)", "Spinosad (bollworm)"] },
      });
    }
    if (rainfall >= 800) {
      recommendations.push({
        crop: "Rice Pusa Basmati 1121", icon: "🍚", color: "#81C784", water: "High", risk: "Low", confidence: 87,
        hybrid: false, investment: 22000, investmentBreakdown: { Seeds: 3000, Fertilizer: 6000, Labour: 6500, Irrigation: 4500, Other: 2000 },
        yieldPerAcre: 15, yieldUnit: "quintals", marketPrice: 3800, marketTrend: "up", marketChange: 12,
        grossRevenue: 57000, profit: 35000, successRate: 85, successNote: "Premium variety, ideal for high rainfall areas",
        advice: { fertilizers: ["DAP at transplanting", "MOP at panicle stage"], pesticides: ["Chlorantraniliprole (stem borer)", "Tricyclazole (blast)"] },
      });
    }
  }

  // Rabi recommendations
  if (season.includes("Rabi")) {
    recommendations.push({
      crop: "Wheat GW-496 (Sharbati)", icon: "🌾", color: "#FBC02D", water: "Medium", risk: "Low", confidence: 88,
      hybrid: false, investment: 10800, investmentBreakdown: { Seeds: 2200, Fertilizer: 3800, Labour: 2800, Irrigation: 1200, Other: 800 },
      yieldPerAcre: 18, yieldUnit: "quintals", marketPrice: 2275, marketTrend: "stable", marketChange: 2,
      grossRevenue: 40950, profit: 30150, successRate: 85, successNote: "Reliable Rabi crop; MSP guaranteed at ₹2275/quintal",
      advice: { fertilizers: ["Urea split dose (basal + CRI)", "DAP at sowing"], pesticides: ["Pendimethalin (weeds)", "Propiconazole (rust)"] },
    });
    recommendations.push({
      crop: "Gram (Chana) JG-11", icon: "🫘", color: "#8D6E63", water: "Low", risk: "Low", confidence: 86,
      hybrid: false, investment: 8500, investmentBreakdown: { Seeds: 3200, Fertilizer: 2000, Labour: 1800, Irrigation: 800, Other: 700 },
      yieldPerAcre: 10, yieldUnit: "quintals", marketPrice: 5800, marketTrend: "up", marketChange: 6,
      grossRevenue: 58000, profit: 49500, successRate: 82, successNote: "Excellent for rain-fed areas, nitrogen-fixing legume",
      advice: { fertilizers: ["Rhizobium seed treatment", "SSP 60 kg/ha"], pesticides: ["Imidacloprid (aphids)", "Mancozeb (wet root rot)"] },
    });
    if (irrigation !== "Rain-fed") {
      recommendations.push({
        crop: "Mustard Pusa Bold", icon: "🌻", color: "#FFD54F", water: "Medium", risk: "Medium", confidence: 79,
        hybrid: false, investment: 7200, investmentBreakdown: { Seeds: 1500, Fertilizer: 2200, Labour: 1500, Irrigation: 1000, Other: 1000 },
        yieldPerAcre: 8, yieldUnit: "quintals", marketPrice: 5500, marketTrend: "stable", marketChange: 3,
        grossRevenue: 44000, profit: 36800, successRate: 76, successNote: "Good oilseed option with stable MSP",
        advice: { fertilizers: ["Sulphur 40 kg/ha", "NPK 40:20:20"], pesticides: ["Imidacloprid (aphids)", "Propiconazole (Alternaria)"] },
      });
    }
  }

  // Zaid recommendations
  if (season.includes("Zaid")) {
    recommendations.push({
      crop: "Moong (Green Gram) Pusa Vishal", icon: "🫘", color: "#2E7D32", water: "Low", risk: "Low", confidence: 90,
      hybrid: false, investment: 6500, investmentBreakdown: { Seeds: 2500, Fertilizer: 1500, Labour: 1200, Irrigation: 800, Other: 500 },
      yieldPerAcre: 5, yieldUnit: "quintals", marketPrice: 7500, marketTrend: "up", marketChange: 10,
      grossRevenue: 37500, profit: 31000, successRate: 88, successNote: "Short-duration Zaid crop, nitrogen-fixing, good market price",
      advice: { fertilizers: ["Rhizobium seed treatment", "SSP 30 kg/ha"], pesticides: ["Thiamethoxam (whitefly)", "Neem oil"] },
    });
    recommendations.push({
      crop: "Cucumber", icon: "🥒", color: "#4CAF50", water: "Medium", risk: "Medium", confidence: 78,
      hybrid: true, investment: 12000, investmentBreakdown: { Seeds: 3000, Fertilizer: 3000, Labour: 3500, Irrigation: 1500, Other: 1000 },
      yieldPerAcre: 80, yieldUnit: "quintals", marketPrice: 1200, marketTrend: "up", marketChange: 7,
      grossRevenue: 96000, profit: 84000, successRate: 74, successNote: "High-value vegetable, needs regular irrigation",
      advice: { fertilizers: ["FYM 10 t/ha", "NPK 50:30:30"], pesticides: ["Mancozeb (downy mildew)", "Neem oil (fruit fly)"] },
    });
  }

  // Budget filtering: sort by ROI and limit
  recommendations.sort((a, b) => {
    const roiA = a.profit / a.investment;
    const roiB = b.profit / b.investment;
    return roiB - roiA;
  });

  // Filter by budget
  const withinBudget = recommendations.filter(r => r.investment <= budget);
  return withinBudget.length > 0 ? withinBudget.slice(0, 5) : recommendations.slice(0, 3);
}

function detectSeason(): string {
  const m = new Date().getMonth() + 1;
  if (m >= 6 && m <= 10) return "Kharif (Jun-Oct)";
  if (m >= 11 || m <= 3) return "Rabi (Nov-Mar)";
  return "Zaid (Mar-Jun)";
}
