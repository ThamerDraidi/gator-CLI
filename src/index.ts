import { register} from "./commands/register.js";
import { loginHandler } from "./commands/login.js";
import {reset} from "./commands/reset.js";
import { users } from "./commands/users.js";
import { agg } from "./commands/agg.js";
import {addfeedHandler } from "./commands/addfeed.js";
import { feeds,} from "./commands/feeds.js";
import { followHandler, followingHnadler } from "./commands/feedfollow.js";
import { User } from "./schema.js";
import { middlewareLoggedIn } from "./middlewareLoggedIn.js";
import { unfollowHandler } from "./commands/unfollow.js";
import { browseHandler } from "./commands/browse.js";


 export type CommandHandler = (args: string[]) => Promise<void>;
  export type UserCommandHandler = (
  user: User,
  ...args: string[]
) => Promise<void>;

async function runCommand(
  registry: Record<string, CommandHandler>,
  cmdName: string,
  args: string[]
): Promise<void> {
  const handler = registry[cmdName];

  if (!handler) {
    throw new Error(`Unknown command: ${cmdName}`);
  }

  await handler(args);
}

async function main(): Promise<void> {
  const commands: Record<string, CommandHandler> = {
    register,
    login: await middlewareLoggedIn(loginHandler),
    reset,
    users,
    agg,
    addfeed: await middlewareLoggedIn(addfeedHandler),
    feeds,
    follow: await middlewareLoggedIn(followHandler),
    following:await middlewareLoggedIn(followingHnadler),
    unfollow: await middlewareLoggedIn(unfollowHandler),
    browse:await middlewareLoggedIn(browseHandler)
  };

  const args = process.argv.slice(2);

  if (args.length === 0) {
    throw new Error("No command provided.");
  }

  const [cmdName, ...cmdArgs] = args;

  try {
    await runCommand(commands, cmdName, cmdArgs);
    process.exit(0); // نجاح
  } catch (err: any) {
    console.error("Error:", err.message);
    process.exit(1); // فشل
  }
}

main();