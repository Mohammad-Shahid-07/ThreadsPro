'use client'
import Image from "next/image";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

interface Props {
  threadId: string;
}
const ShareButton = ({threadId }: Props) => {
  
  
  
  const router = useRouter();
  const pathname = usePathname();
  
  
  const handleClick = (threadId : string) => {
 
    if (navigator.share) {
      navigator.share({
        title: document.title,
        url: `/thread/${threadId}`,
      });
    } else {
      const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        window.location.href,
      )}`;
      window.open(shareUrl, "_blank");
    }
  };

  return (
    <button onClick={() =>  handleClick(threadId)}>
      <Image
        src="/assets/share.svg"
        alt="share"
        width={24}
        height={24}
        className="object-contain cursor-pointer"
      />
    </button>
  );
};

export default ShareButton;
import React from 'react'

