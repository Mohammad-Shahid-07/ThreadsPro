import UserCard from "@/components/cards/UserCard";
import PostThread from "@/components/forms/PostThread";
import ProfileHeader from "@/components/shared/ProfileHeader";


import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";


const Page = async () => {
    const user = await currentUser();
    if (!user)  redirect("/sign-in");
    const userInfo = await fetchUser(user.id)
    if (!userInfo?.onboarded) redirect("/onboarding");
    const res = await fetchUsers({
        userId: user.id,
        searchString: '',
        pageNuber: 1,
        pageSize: 25
    });
  return (
    <section>
        <h1 className="head-text ">Search</h1>
        {/* search Bar */}

        <div className="mt-14 flex flex-col gap-9">
            {res.users.length === 0 ? (
                <p className="no-result">No Users</p>
            ) : (
                <>
              {  res.users.map((person) => (
                 <UserCard 
                 key={person.id}
                 id={person.id}
                 name={person.name}
                 username={person.username}
                 imgUrl = {person.image}
                 personType='User'
                 />
                ))}
                </>
            ) }
             
        </div>
    </section>
  )
}

export default Page;