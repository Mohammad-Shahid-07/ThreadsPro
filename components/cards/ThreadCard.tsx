
import { formatDateString } from "@/lib/utils";


// Inside your component function

import Image from "next/image";
import Link from "next/link";
import ShareButton from "./Share";
import Likes from "./Likes";


interface Props {
  id: string;
  currentUserId: string;
  parentId: string | null;
  content: string;
  author: {
    name: string;
    image: string;
    id: string;
  };
  createdAt: string;
  community: {
    name: string;
    image: string;
    id: string;

  };

  comments: {
    author: {
      image: string;
    };
    id: string;
  }[];
  isComment?: boolean;
  likes: string[];
}

const ThreadCard = async ({
  id,
  currentUserId,
  parentId,
  content,
  author,
  createdAt,
  community,
  comments,
  isComment,
  likes,
}: Props) => {
  

  
const threadId = id.toString()
  
  return (
    <article
      className={`flex w-full flex-col rounded-xl ${
        isComment ? "px-0 xs:px-7" : "bg-dark-2 p-7 mb-5 "
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
              <Image
                src={author.image}
                alt="Profile Image"
                fill
                className="cursor-pointer rounded-full"
              />
            </Link>
            <div className="thread-card_bar" />
          </div>

          <div className="flex w-full flex-col">
            <Link href={`/profile/${author.id}`} className=" w-fit">
              <h5 className="cursor-pointer text-base-semibold text-light-1">
                {author.name}
              </h5>
            </Link>
            <p className="mt-2 text-small-regular text-light-2"> {content}</p>
            <div className={`${isComment && "mb-10"} mt-5 flec flex-col gap-3`}>
              <div className="flex gap-3.5">
                <Likes threadId={threadId} likes={likes.length}  currentUserId={currentUserId} />
                <Link href={`/thread/${id}`}>
                  <Image
                    src="/assets/reply.svg"
                    alt="reply"
                    width={24}
                    height={24}
                    className="object-contain cursor-pointer"
                  />
                </Link>
               <ShareButton  threadId={threadId} />
                <Image
                  src="/assets/repost.svg"
                  alt="repost"
                  width={24}
                  height={24}
                  className="object-contain cursor-pointer"
                />
              </div>
              {isComment && comments.length > 0 && (
                <Link href={`/thread/${id}`}>
                  <p className="mt-1 text-subtle-medium text-gray-1 ">
                    {comments.length} Replies
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>

        {!isComment && community && (
          <Link href={`/community/`}>
            <div className="flex mt-5 flex-col items-center">
              <p className="text-subtle-medium text-gray-1">
                {formatDateString(createdAt)} - {community?.name} community
              </p>
              <Image
                src={community?.image}
                alt="Community Image"
                fill
                className="cursor-pointer ml-1 object-cover rounded-full"
              />
              <div className="thread-card_bar" />
            </div>
          </Link>
        )}
      </div>
    </article>
  );
};
export default ThreadCard;
