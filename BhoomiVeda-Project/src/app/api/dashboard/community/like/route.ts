import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { postId } = await req.json();
    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    // Check if already liked
    const existingLike = await db.communityLike.findUnique({
      where: {
        postId_userId: { postId, userId: user.id },
      },
    });

    if (existingLike) {
      // Unlike
      await db.communityLike.delete({ where: { id: existingLike.id } });
      return NextResponse.json({ success: true, liked: false, message: "Post unliked" });
    } else {
      // Like
      await db.communityLike.create({
        data: { postId, userId: user.id },
      });

      // Add activity
      await db.activity.create({
        data: {
          userId: user.id,
          icon: "❤️",
          text: "You liked a community post",
          type: "social",
        },
      });

      return NextResponse.json({ success: true, liked: true, message: "Post liked" });
    }
  } catch (error) {
    console.error("[Like Error]", error);
    return NextResponse.json({ error: "Failed to like post" }, { status: 500 });
  }
}
