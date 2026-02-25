import { UserCommandHandler } from "src";
import { getUser } from "src/config";
import { getFeedByUrl } from "src/db/queries/feed";
import { createFeedFollow, getFeedFollowsForUser } from "src/db/queries/feedFollows";
import { getUserByName } from "src/db/queries/users";
import { User } from "src/schema";

export const followHandler:UserCommandHandler=async function (
  user:User,
  ...args:string[])
{
  const url=args[0];
  if (!url) {
    console.log("Please provide a feed URL.");
    process.exit(1);
  }
  const feed = await getFeedByUrl(url);

  if (!feed) {
    console.log("Feed not found.");
    process.exit(1);
  }

  const feedFollow = await createFeedFollow(user.id, feed.id);


  console.log(`User ${feedFollow.userName} is now following ${feedFollow.feedName}`);
}
export const followingHnadler:UserCommandHandler=async function (
  user:User,
  ...args:string[])
{
  const follows = await getFeedFollowsForUser(user.id);

  if (follows.length === 0) {
    console.log("You are not following any feeds.");
    return;
  }

  console.log(`Feeds followed by ${user.name}:`);

  for (const follow of follows) {
    console.log(`- ${follow.feedName}`);
  }
};