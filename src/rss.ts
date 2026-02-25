import { XMLParser } from "fast-xml-parser";
type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    items: RSSItem[];
  };
};
export async function fetchFeed(feedURL: string) {
  const response = await fetch(feedURL, {
    headers: { "User-Agent": "gator" },
  });
  const xmlData = await response.text();

  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "" });
 const parsed = parser.parse(xmlData);
if (!parsed.rss || !parsed.rss.channel) {
  throw new Error("Invalid RSS feed: missing channel field");
}

const channel = parsed.rss.channel;
const { title, link, description } = channel;


if (typeof title !== "string" || typeof link !== "string" || typeof description !== "string") {
  throw new Error("Invalid RSS feed: channel is missing required fields");
}

let items: any[] = [];


if (channel.item) {
  items = Array.isArray(channel.item) ? channel.item : [channel.item];
}


const validItems = items
  .filter(item => item.title && item.link && item.description && item.pubDate)
  .map(item => ({
    title: item.title,
    link: item.link,
    description: item.description,
    pubDate: item.pubDate,
  }));

const result: RSSFeed = {
    channel: {
      title,
      link,
      description,
      items: validItems,
    },
  };

  return result;

}