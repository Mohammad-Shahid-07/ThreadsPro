import { fetchUserPosts } from "@/lib/actions/user.actions"
import { redirect } from "next/navigation";
import ThreadCard from "../cards/ThreadCard";

interface Props{
    currentUserId: string,
    accountId: string,
    accountType: string
}
const ThreadTab = async ( {currentUserId, accountId, accountType}: Props) => {
    let res = await fetchUserPosts(accountId);
    if (!res) {
        redirect('/')
    }
  return (
    <section className="mt-9 flex flex-col gap-10">
        {res.threads.map((thread: any) => (
            <ThreadCard
            key={thread._id}
            id={thread._id}
            currentUserId={currentUserId}
            parentId={thread.parentId}
            content= {thread.text}
            author={thread.author}
            createdAt={thread.createdAt}
            community={thread.community}
            comments={thread.children}
            isComment
            />
        ))}
    </section>
  )
}

export default ThreadTab