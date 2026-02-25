import { deleteAllUsers } from "../db/queries/users";

export async function reset(args: string[]): Promise<void> {
  await deleteAllUsers();
  console.log("All users deleted successfully.");
}