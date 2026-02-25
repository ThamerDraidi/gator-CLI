import { db } from "..";
import { users } from "../../schema";
import { eq } from "drizzle-orm"; 

export async function createUser(name: string) {
  const [result] = await db.insert(users).values({ name: name }).returning();
  return result;
}


export async function getUserByName(name: string | undefined) {
  if(name){
  try {
    const usersFound = await db.select().from(users).where(eq(users.name, name));
    return usersFound[0] ?? null; 
  
  } catch (err) {
    console.error("Database error while fetching user:", err);
    return null;  
  }
}
}


  export async function deleteAllUsers() {
  await db.delete(users);
}
export async function getAllUsers() {
  try {
    const allUsers = await db.select().from(users);
    return allUsers;
  } catch (err:any) {
    console.error(err.message);
    return [];
  }
}
