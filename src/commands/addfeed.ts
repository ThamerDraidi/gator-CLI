import { createFeed } from "../db/queries/feed";
import { getUser } from "../config";
import { getUserByName } from "../db/queries/users";

import type { Feed } from "../schema.js";
import type { User } from "../schema.js";
import { createFeedFollow } from "src/db/queries/feedFollows";
import { UserCommandHandler } from "src";

function printFeed(feed: Feed, user: User) {
  console.log("Feed created successfully:");
  console.log("ID:", feed.id);
  console.log("Name:", feed.name);
  console.log("URL:", feed.url);
  console.log("User:", user.name);
  console.log("Created At:", feed.created_at);
}
export const addfeedHandler:UserCommandHandler=async function(
  user:User,
  ...args:string[]){
  if (args.length < 2) {
    throw new Error("Usage: addfeed <name> <url>");
  }
   const url = args[args.length - 1];
  const name = args.slice(0, -1).join(" "); 
  const newFeed = await createFeed(name, url,user.id);
  const folowFeed=await createFeedFollow(user.id,newFeed.id);
   printFeed(newFeed, user);
  console.log(`feed ${folowFeed.feedName} followed by ${folowFeed.userName}`);
}
