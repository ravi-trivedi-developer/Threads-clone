"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.mode";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createThread({
  text,
  author,
  communityId,
  path,
}: Params) {
  try {
    connectToDB();

    const createdThread = await Thread.create({
      text,
      author,
      community: null,
    });

    // Update User Modal
    await User.findByIdAndUpdate(author, {
      $push: {
        threads: createdThread._id,
      },
    });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error creating thread: ${error.message} `);
  }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  connectToDB();

  // calculate the number of posts to skip
  const skipAmount = (pageNumber - 1) * pageSize;
  // (1 - 1) * 20 = 0
  // (2 - 1) * 20 = 20
  // (3 - 1) * 20 = 40
  // (4 - 1) * 20 = 60

  // Fetch posts that have no parents [top-level threads]
  const postQuery = await Thread.find({
    parentId: {
      $in: [null, undefined],
    },
  })
    .sort({
      createdAt: "desc",
    })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({
      path: "author",
      model: User,
    })
    .populate({
      path: "children",
      populate: {
        path: "author",
        model: User,
        select: "_id name parentId image",
      },
    })
    .exec();

  const totalPostsCount = await Thread.countDocuments({
    parentId: {
      $in: [null, undefined],
    },
  });

  const isNext = totalPostsCount > skipAmount + postQuery.length;

  return {
    isNext,
    postQuery,
  };
}

export async function fetchThreadById(id: string) {
  console.log("~ fetchThreadById ~ id: ----------------------", id);
  connectToDB();

  try {
    const thread = await Thread.findById(id)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "_id id name parentId image",
            },
          },
        ],
      })
      .exec();

    return thread;
  } catch (error) {
    throw new Error(`Error while fetching thread`);
  }
}

export async function addCommentToThread(
  threadId: string,
  commentText: string,
  userId: string,
  path: string
) {
  connectToDB();

  try {
    // Find the original thread by its ID
    const originalThread = await Thread.findById(threadId);

    if (!originalThread) {
      throw new Error("Thread not found");
    }

    // Create new thread with new comment text
    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId,
    });

    // Save new Thread
    const savedCommentThread = await commentThread.save();

    // Update the original Thread to include the comment
    originalThread.children.push(savedCommentThread._id);

    // Save the original thread
    await originalThread.save();

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error while adding reply ${error.message}`);
  }
}
