import { getNextFeedToFetch, markFeedFetched } from "src/db/queries/feed";
import { fetchFeed } from "../rss";
import { createPost } from "src/db/queries/posts";
export async function agg(args: string[]): Promise<void> {
  if (args.length < 1) {
    console.log("Usage: agg <time_between_reqs>");
    return;
  }
  const timeBetweenRequests = parseDuration(args[0]);

  console.log(`Collecting feeds every ${args[0]}`);

  scrapeFeeds().catch((err) => console.error(err));

  const interval = setInterval(() => {
    scrapeFeeds().catch((err) => console.error(err));
  }, timeBetweenRequests);

  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      console.log("\nShutting down feed aggregator...");
      clearInterval(interval);
      resolve();
    });
  });
}
export async function scrapeFeeds() {
  const feed = await getNextFeedToFetch();

  if (!feed) {
    console.log("No feeds to fetch.");
    return;
  }

  console.log(`Fetching feed: ${feed.name} (${feed.url})`);

  try {
    const rss = await fetchFeed(feed.url);

    for (const item of rss.channel.items) {
      if (!item.link || !item.title) {
        continue;
      }

      let publishedAt: Date | null = null;

      if (item.pubDate) {
        const parsedDate = new Date(item.pubDate);
        if (!isNaN(parsedDate.getTime())) {
          publishedAt = parsedDate;
        }
      }

      await createPost({
        title: item.title,
        url: item.link,
        description: item.description ?? null,
        publishedAt,
        feedId: feed.id,
      });
    }

    await markFeedFetched(feed.id);

  } catch (err) {
    console.error(`Error fetching feed ${feed.url}:`, err);
  }
}

export function parseDuration(durationStr: string): number {
 
  const regex = /^(\d+)(ms|s|m|h)$/;
  const match = durationStr.match(regex);

  if (!match) {
    throw new Error(
      `Invalid duration format: ${durationStr}. Use format like 1s, 5m, 2h.`
    );
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

 
  switch (unit) {
    case "ms":
      return value;
    case "s":
      return value * 1000;
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    default:
      throw new Error(`Unknown time unit: ${unit}`);
  }
}