import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const notifications = await db.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    // Format notifications with relative time
    const formatted = notifications.map(n => ({
      id: n.id,
      title: n.title,
      desc: n.desc,
      type: n.type,
      read: n.read,
      time: getRelativeTime(n.createdAt),
    }));

    return NextResponse.json({ success: true, notifications: formatted });
  } catch (error) {
    console.error("[Notifications Error]", error);
    return NextResponse.json({ error: "Failed to get notifications" }, { status: 500 });
  }
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}
