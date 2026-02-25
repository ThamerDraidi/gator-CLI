import { UserCommandHandler } from "src";
import { deleteFeedFollowBy } from "src/db/queries/feedFollows";
import { User } from "src/schema";

 export const unfollowHandler :UserCommandHandler=async function (user:User,...args:string[]) {
    const url=args[0];
    if(!url) throw Error("the url is required");
    await deleteFeedFollowBy(user.id,url);
        
}