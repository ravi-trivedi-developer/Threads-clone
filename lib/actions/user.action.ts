"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Thread from "../models/thread.mode";

interface Params {
  userId: string;
  name: string;
  username: string;
  bio: string;
  image: string;
  path: string;
}

export async function fetchUser(userId: string) {
  try {
    connectToDB();

    return await User.findOne({ id: userId });
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

export async function updateUser({
  userId,
  name,
  username,
  bio,
  image,
  path,
}: Params): Promise<void> {
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
        onboarded: true,
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

export async function fetchUserPosts(userId: string) {
  try {
    connectToDB();

    // fetch user threads
    const threads = await User.findOne({
      id: userId,
    }).populate({
      path: "threads",
      model: Thread,
      populate: {
        path: "children",
        model: Thread,
        populate: {
          path: "author",
          model: User,
          select: "name image id",
        },
      },
    });

    return threads;
  } catch (error: any) {
    throw new Error(`Error while fetching user threads ${error.message}`);
  }
}
