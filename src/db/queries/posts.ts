import { db } from "../index";
import { desc, eq } from "drizzle-orm";
import { feeds, feedFollows, posts } from "../../schema";

export async function createPost(data: {
  title: string;
  url: string;
  description?: string | null;
  publishedAt?: Date | null;
  feedId: string;
}) {
  const [post] = await db
    .insert(posts)
    .values({
      title: data.title,
      url: data.url,
      description: data.description ?? null,
      publishedAt: data.publishedAt ?? null,
      feedId: data.feedId,
    })
    .onConflictDoNothing() // يمنع إدخال نفس url مرتين
    .returning();

  return post;
}
export async function getPostsForUser(
  userId: string,
  limit: number
) {
  return await db
    .select({
      id: posts.id,
      title: posts.title,
      url: posts.url,
      description: posts.description,
      publishedAt: posts.publishedAt,
      feedName: feeds.name,
    })
    .from(posts)
    .innerJoin(feeds, eq(posts.feedId, feeds.id))
    .innerJoin(feedFollows, eq(feedFollows.feed_id, feeds.id))
    .where(eq(feedFollows.user_id, userId))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
}