import { feeds, users,feedFollows } from "../../schema";
import { db } from "..";
import { getFeedByUrl } from "./feed";
import { eq, and } from "drizzle-orm";
export async function createFeedFollow(userId: string, feedId: string) {
  
  const [newFeedFollow] = await db
    .insert(feedFollows)
    .values({
      user_id: userId,
      feed_id: feedId,
    })
    .returning();

  

  const [result] = await db
    .select({
      id: feedFollows.id,
      createdAt: feedFollows.created_at,
      updatedAt: feedFollows.updated_at,
      userId: feedFollows.user_id,
      feedId: feedFollows.feed_id,
      userName: users.name,
      feedName: feeds.name,
    })
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feed_id, feeds.id))
    .innerJoin(users, eq(feedFollows.user_id, users.id))
    .where(eq(feedFollows.id, newFeedFollow.id));

  return result;
}
export async function getFeedFollowsForUser(userId: string) {
  const results = await db
    .select({
      id: feedFollows.id,
      createdAt: feedFollows.created_at,
      updatedAt: feedFollows.updated_at,
      userId: feedFollows.user_id,
      feedId: feedFollows.feed_id,
      userName: users.name,
      feedName: feeds.name,
    })
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feed_id, feeds.id))
    .innerJoin(users, eq(feedFollows.user_id, users.id))
    .where(eq(feedFollows.user_id, userId));

  return results;
}

export async function deleteFeedFollow(userId: string, feedId: string) {
  const [deletedFeedFollow] = await db
    .delete(feedFollows)
    .where(
      and(
        eq(feedFollows.user_id, userId),
        eq(feedFollows.feed_id, feedId)
      )
    )
    .returning();

  if (!deletedFeedFollow) return null;

  const [result] = await db
    .select({
      id: feedFollows.id,
      createdAt: feedFollows.created_at,
      updatedAt: feedFollows.updated_at,
      userId: feedFollows.user_id,
      feedId: feedFollows.feed_id,
      userName: users.name,
      feedName: feeds.name,
    })
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feed_id, feeds.id))
    .innerJoin(users, eq(feedFollows.user_id, users.id))
    .where(eq(feedFollows.id, deletedFeedFollow.id));

  return result;
}
export async function deleteFeedFollowBy(userId: string, feedUrl: string) {
 
const feed=await getFeedByUrl(feedUrl);

  if (!feed) return null;
   await deleteFeedFollow(userId,feed.id);
}