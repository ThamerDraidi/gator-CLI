import { getAllUsers } from "../db/queries/users";
import { getUser } from "../config.js";

export async function users(args: string[]): Promise<void> {
    const users=await getAllUsers();
    const currentuser=getUser();
  for(const user of users){
  if(user.name ===currentuser)console.log(`*${user.name} (current)`);
  else console.log(`*${user.name}`);
  }
}