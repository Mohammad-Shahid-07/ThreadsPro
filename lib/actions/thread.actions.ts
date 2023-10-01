"use server";
import { revalidatePath } from "next/cache";
import User from "../models/User.model";
import Thread from "../models/thread.model";
import { connectToDatabase } from "../mongoose";

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
  connectToDatabase();
  try {
    const createdThread = await Thread.create({
      text,
      author,
      community: null,
    });

    // update user modal
    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id },
    });
    revalidatePath(path);
  } catch (error: any) {
    console.log(error);
    throw new Error(`Error creating thread: ${error.message}    `);
  }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  connectToDatabase();

  // Calculate the number of posts to skip based on the page number and page size.
  const skipAmount = (pageNumber - 1) * pageSize;

  // Create a query to fetch the posts that have no parent (top-level threads) (a thread that is not a comment/reply).
  const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({
      path: "author",
      model: User,
    })
    .populate({
      path: "children", // Populate the children field
      populate: {
        path: "author", // Populate the author field within children
        model: User,
        select: "_id name parentId image", // Select only _id and username fields of the author
      },
    });

  // Count the total number of top-level posts (threads) i.e., threads that are not comments.
  const totalPostsCount = await Thread.countDocuments({
    parentId: { $in: [null, undefined] },
  }); // Get the total count of posts

  const posts = await postsQuery.exec();

  const isNext = totalPostsCount > skipAmount + posts.length;

  return { posts, isNext };
}

export async function fetchThreadById(id: string) {
  connectToDatabase();
  try {
    const thread = await Thread.findById(id)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "children",
        populate: {
          path: "author",
          model: User,
          select: "_id id name parentId image",
        },
      })
      .exec();
    return thread;
  } catch (error: any) {
    throw new Error(`Error fetching thread ${error.message} `);
  }
}

export async function addCommentToThread(
  threadId: string,
  commentText: string,
  userId: string,
  path: string
) {
  connectToDatabase();
  try {
    const orignalThread = await Thread.findById(threadId)

    if(!orignalThread){
    throw new Error(`Error fetching orignalThread `);
    }

    // create a new thread with text
    const CommentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId
    })
    const savedCommentThread = await CommentThread.save()

    orignalThread.children.push(savedCommentThread._id)

    await orignalThread.save()

    revalidatePath(path)
  } catch (error: any) {
    throw new Error(`Error fetching thread ${error.message} `);

  }
}
