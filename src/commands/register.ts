import { createUser, getUserByName } from "../db/queries/users";
import { setUser } from "../config";

export async function register(args: string[]) {
  const name = args[0];

 
  if (!name) throw new Error("Please provide a name.")


  const user = await createUser(name);

 
  setUser(name);

  
  console.log(`User "${name}" created successfully!`);
  console.log(user); 
}