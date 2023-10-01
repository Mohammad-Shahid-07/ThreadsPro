"use server";

import { revalidatePath } from "next/cache";
import User from "../models/User.model";
import { connectToDatabase } from "../mongoose";
import Thread from "../models/thread.model";
import { FilterQuery, SortOrder } from "mongoose";

interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}
export async function updateUser({
  userId,
  bio,
  name,
  path,
  username,
  image,
}: Params): Promise<void> {
  try {
    connectToDatabase();

    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

export async function fetchUser(userId: string) {
  try {
    connectToDatabase();

    return await User.findOne({ id: userId });
    // .populate({path: 'Communities', model: 'Community'});
  } catch (error) {
    throw new Error(`Error fetching user: ${error}`);
  }
}

export async function fetchUserPosts(userId: string) {
  try {
    connectToDatabase();

    const threads = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: {
        path: "author",
        model: User,
        select: "name image id",
      },
    });

    // .populate({path: 'Communities', model: 'Community'});
    return threads;
  } catch (error) {
    throw new Error(`Error fetching Posts: ${error}`);
  }
}
export async function fetchUsers({
  userId,
  searchString = "",
  pageNuber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string;
  pageNuber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    connectToDatabase();
    const skipAmount = (pageNuber - 1) * pageSize;
    const regex = new RegExp(searchString, "i");

    const q: FilterQuery<typeof User> = {
      id: { $ne: userId },
    };
    if (searchString.trim() !== "") {
      q.$or = [{ username: { $regex: regex } }, { name: { $regex: regex } }];
    }
    const sortOptions = { createdAt: sortBy };
    const usersQuery = User.find(q)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalUsersCount = await User.countDocuments(q);

    const users = await usersQuery.exec();
    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error: any) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
}

export async function getActivity(userId: string) {
  try {
    connectToDatabase();

    const userThreads = await Thread.find({ author: userId });

    const childThreadIds = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children);
    }, []);

    const replies = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId },
    }).populate({
      path: "author",
      model: User,
      select: "name image _id",
    });

    return replies;
  } catch (error) {
    throw new Error(`Error fetching Activity: ${error}`);
  }
}