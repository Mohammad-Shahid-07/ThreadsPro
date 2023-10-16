"use client";
import { addLikes, hasLike } from "@/lib/actions/thread.actions";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  threadId: string;
  currentUserId: string;
  likes: number;
}

const Likes = ({ threadId, currentUserId , likes}: Props) => {
  const [hasLiked, setHasLiked] = useState(false);
  const [like, setLikes] = useState(likes);
  const pathname = usePathname();

  useEffect(() => {
      const fetchData = async () => {
        const userHasLiked = await hasLike(currentUserId, threadId);
      setHasLiked(userHasLiked || false);
      // Fetch and set the number of likes here if needed.
    };
    fetchData();
  }, [pathname, currentUserId, threadId, likes]);

  const handleLike = async () => {
    const res = await addLikes(currentUserId, threadId);
    setLikes(res);
  };

  return (
    <>
  <div className={hasLiked ? `fade-in` : ''}>
        <Image
          src={hasLiked ? "/assets/heart-filled.svg" : "/assets/heart-gray.svg"}
          onClick={() => handleLike()}
          alt="reply"
          width={24}
          height={24}
          className="object-contain cursor-pointer"
        />
      </div>
      {like > 0 && (
        <span className={`text-light-1`}>{likes}</span>
      )}
    </>
  );
};

export default Likes;
