import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Check if posts already exist
    const existingPosts = await db.communityPost.count();
    if (existingPosts > 0) {
      return NextResponse.json({ success: true, message: "Sample data already exists" });
    }

    // Create sample community posts
    await db.communityPost.createMany({
      data: [
        {
          userId: user.id,
          author: "Ramesh Kumar",
          avatar: "RK",
          avatarColor: "#2E7D32",
          location: "Vidisha, MP",
          content: "Just harvested my Soybean crop using BhoomiVeda recommendations — 28% higher yield than last year! The AI suggestion to switch to JS-335 variety was spot on 🌾",
          tags: JSON.stringify(["Soybean", "Success"]),
        },
        {
          userId: user.id,
          author: "Priya Sharma",
          avatar: "PS",
          avatarColor: "#1565C0",
          location: "Sehore, MP",
          content: "Anyone dealing with yellow mosaic virus in black gram this season? My plants are showing symptoms on 20% of field. Looking for organic treatment options before I try chemical intervention.",
          tags: JSON.stringify(["BlackGram", "Disease", "Help"]),
        },
        {
          userId: user.id,
          author: "Arjun Mehta",
          avatar: "AM",
          avatarColor: "#E65100",
          location: "Hoshangabad, MP",
          content: "The new soil testing feature is incredible. Got my complete micro-nutrient report in 2 days vs 2 weeks at the local lab. Boron deficiency identified early — saved my wheat crop!",
          tags: JSON.stringify(["SoilHealth", "Technology"]),
        },
      ],
    });

    // Create some activities
    await db.activity.createMany({
      data: [
        { userId: user.id, icon: "🌱", text: "AI recommended Soybean for Kharif season", type: "ai" },
        { userId: user.id, icon: "💧", text: "Irrigation scheduled for Field B — 6 AM tomorrow", type: "water" },
        { userId: user.id, icon: "📊", text: "Market prices updated — Wheat up 8%", type: "market" },
        { userId: user.id, icon: "🏆", text: "You earned 'Top Farmer' badge this week!", type: "badge" },
        { userId: user.id, icon: "⚠️", text: "Soil pH alert: Field A slightly acidic (5.8)", type: "alert" },
      ],
    });

    // Create some notifications
    await db.notification.createMany({
      data: [
        { userId: user.id, title: "Rain alert", desc: "Heavy rainfall expected in 48 hours", type: "warning" },
        { userId: user.id, title: "Price surge", desc: "Soybean prices up 12% at Bhopal mandi", type: "success" },
        { userId: user.id, title: "New scheme", desc: "PM Kisan 14th installment released", type: "info" },
        { userId: user.id, title: "Crop advice", desc: "Optimal sowing window starts next week", type: "ai" },
      ],
    });

    return NextResponse.json({ success: true, message: "Sample data seeded successfully" });
  } catch (error) {
    console.error("[Seed Error]", error);
    return NextResponse.json({ error: "Failed to seed data" }, { status: 500 });
  }
}
