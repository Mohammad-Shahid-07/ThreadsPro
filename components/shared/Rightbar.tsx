import { fetchUsers } from "@/lib/actions/user.actions";
import UserCard from "../cards/UserCard";
import { currentUser } from "@clerk/nextjs";

async function  RightSidebar() {
    const user = await currentUser();
    const res = await fetchUsers({
        userId: user?.id || '',
        searchString: '',
        pageNumber: 1,
        pageSize: 25
    });
    return (
        <section className="custom-scrollbar rightsidebar ">
            <div className="flex flex-1 flex-col justify-start">
                <h3 className="text-heading4-medium text-light-1">Suggested Users</h3>
               { res.users.map((person) => (
                 <UserCard 
                 key={person.id}
                 id={person.id}
                 name={person.name}
                 username={person.username}
                 imgUrl = {person.image}
                 personType='User'
                 />
                ))}
            </div>
        </section>
    )
}
export default RightSidebar;