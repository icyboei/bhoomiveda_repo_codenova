import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get all community posts, with like status for current user
    const posts = await db.communityPost.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        _count: {
          select: { likes: true },
        },
      },
    });

    const userLikes = await db.communityLike.findMany({
      where: { userId: user.id },
      select: { postId: true },
    });

    const likedPostIds = new Set(userLikes.map(l => l.postId));

    const formatted = posts.map(p => {
      let tags: string[] = [];
      try { tags = JSON.parse(p.tags); } catch { tags = []; }

      return {
        id: p.id,
        author: p.author,
        avatar: p.avatar,
        avatarColor: p.avatarColor,
        location: p.location,
        content: p.content,
        tags,
        likes: p._count.likes,
        liked: likedPostIds.has(p.id),
        time: getRelativeTime(p.createdAt),
      };
    });

    return NextResponse.json({ success: true, posts: formatted });
  } catch (error) {
    console.error("[Community Error]", error);
    return NextResponse.json({ error: "Failed to get community posts" }, { status: 500 });
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
