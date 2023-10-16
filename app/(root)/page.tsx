
import { fetchPosts } from "@/lib/actions/thread.actions";

import ThreadCard from '@/components/cards/ThreadCard'
import { currentUser } from "@clerk/nextjs";
export default async  function Home() {

      const user = await currentUser();
      const results = await fetchPosts(1, 30); // Await the Promise
      
  return (
    <>
      <h1 className="head-text">Threads</h1>
      {
        results.posts.length === 0 ?  (
         <p className="no-result">No Threads Found</p>
        ) : (
          <>
          { 
          results.posts.map((post) => (
            <ThreadCard 
            key={post._id}
            id={post._id}
            currentUserId={user?.id || ""}
            parentId={post.parentId}
            content= {post.text}
            author={post.author}
            createdAt={post.createdAt}
            community={post.community}
            comments={post.children}
            likes= {post.likes}

            />
          ))
          }
         
          </>
         
        )
      }
       </>
  )
}