import { getUser } from "./config.js";
import { getUserByName } from "./db/queries/users.js";
import type {CommandHandler, UserCommandHandler} from "./index.js";
export async function middlewareLoggedIn(handler:UserCommandHandler) :Promise<CommandHandler>{
   return async function(args: string[]) {
    const user = await getUserByName(getUser());

    if (!user) {
      console.log("User not found");
      return;
    }
    return handler(user, ...args);
  }
}
