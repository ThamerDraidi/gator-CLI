
import { getFeedByUrl, getFeeds } from "../db/queries/feed";
export async function feeds(): Promise<void> {
  const allFeeds = await getFeeds();

  if (allFeeds.length === 0) {
    console.log("No feeds found.");
    return;
  }

  for (const feed of allFeeds) {
    console.log("Name:", feed.feed_name);
    console.log("URL:", feed.feed_url);
    console.log("User:", feed.user_name);
  }
}
