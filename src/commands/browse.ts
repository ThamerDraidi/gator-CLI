
import { UserCommandHandler } from "src";
import { getPostsForUser } from "src/db/queries/posts";

export const browseHandler: UserCommandHandler = async function (
  user,
  ...args: string[]
) {
  let limit = 2;

  if (args.length > 0) {
    const parsed = parseInt(args[0], 10);

    if (!isNaN(parsed) && parsed > 0) {
      limit = parsed;
    }
  }

  const posts = await getPostsForUser(user.id, limit);

  if (posts.length === 0) {
    console.log("No posts found.");
    return;
  }

  for (const post of posts) {
    console.log("--------------------------------------------------");
    console.log(`Title: ${post.title}`);
    console.log(`Feed: ${post.feedName}`);
    console.log(`Published: ${post.publishedAt ?? "N/A"}`);
    console.log(`URL: ${post.url}`);
  }
};