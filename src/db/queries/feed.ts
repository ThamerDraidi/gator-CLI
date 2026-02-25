import { db } from "..";
import { feeds, users,feedFollows } from "../../schema";
import { eq, sql } from "drizzle-orm";

export async function createFeed(name: string, url: string,user_id :string) {
  const [newFeed] = await db.insert(feeds)
    .values({
      name,
      url,
      user_id:user_id,
    })
    .returning();

  return newFeed;
}


export async function getFeeds() {
  const results = await db
    .select({
      feed_id: feeds.id,
      feed_name: feeds.name,
      feed_url: feeds.url,
      user_name: users.name,
    })
    .from(feeds)
    .innerJoin(users, eq(feeds.user_id, users.id));

  return results;
}

export async function getFeedByUrl(url: string) {
  const [feed] = await db
    .select()
    .from(feeds)
    .where(eq(feeds.url, url));

  return feed;
}
export async function markFeedFetched(feedId: string) {
  const now = new Date();

  const [updatedFeed] = await db
    .update(feeds)
    .set({
      last_fetched_at: now,
      updated_at: now,
    })
    .where(eq(feeds.id, feedId))
    .returning();

  return updatedFeed;
}
export async function getNextFeedToFetch() {
  const [nextFeed] = await db
    .select()
    .from(feeds)
    .orderBy(sql`last_fetched_at ASC NULLS FIRST`) 
    .limit(1);

  return nextFeed || null;
}