import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

export async function updateUser(
  userId: string,
  name: string,
  username: string,
  bio: string,
  image: string,
  path: string
): Promise<void> {
  connectToDB();

  try {
    await User.findOneAndUpdate(
      {
        id: userId,
      },
      {
        username: username.toLocaleLowerCase(),
        name,
        bio,
        image,
        path,
      },
      {
        upsert: true, // this will create a new row if does not exists
      }
    );

    if (path === "/profile/edit") {
      revalidatePath(path); // update your cached data without waiting for a revalidation period to expire
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user : ${error.message}`);
  }
}
