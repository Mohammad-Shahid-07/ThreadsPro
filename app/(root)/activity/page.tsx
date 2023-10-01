import PostThread from "@/components/forms/PostThread";
import ProfileHeader from "@/components/shared/ProfileHeader";

import { fetchUser, fetchUsers, getActivity } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const Page = async () => {
  const user = await currentUser();
  if (!user) redirect("/sign-in");
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");
  const activity = await getActivity(userInfo._id);
  console.log(activity);
  
  return (
    <section>
      <h1 className="head-text mb-10">Activity</h1>
      <section className="mt-10 flex flex-col gap-5 ">
        {activity.length > 0 ? (
          <>
            {activity.map((activity) => (
              <Link
                href={`/thread/${activity.parentId}`}
                key={activity._id}
              >
                <article className="activity-card">
                  <div className="flex gap-2">
                  <Image
                    src={activity.author.image}
                    width={20}
                    height={20}
                    alt="Profile Pic"
                    className="rounded-full object-cover"
                  />
                  <p className="!text-small-regular  text-light-1 ">
                    <span className="mr-3 text-primary-500">{activity.author.name}</span>
                    Replied 
                  </p>
                  </div>
                  <div className="flex gap-5 flex-col">
                  <p className="!text-small-regular ml-7  text-light-1">To Your Thread {" "}
                  <span className="ml-2 text-primary-500">" {activity.text} "</span>
                  </p>
                  </div>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className="!text-base-regular text-light-3">No Activity Yet</p>
        )}
      </section>
    </section>
  );
};

export default Page;
