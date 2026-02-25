import { getUserByName } from "../db/queries/users";
import { setUser } from "../config.js";
import { User } from "src/schema";
import { UserCommandHandler } from "src";

export const loginHandler:UserCommandHandler=async function (
  user:User,
  ...args:string[])
{
  if (args.length === 0) {
    throw new Error("Username is required for login.");
  }

  const username = args[0];

  setUser(username);
  console.log(`Logged in as: ${username}`);
}