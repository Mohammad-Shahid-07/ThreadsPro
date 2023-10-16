"use client";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import Image from "next/image";
import { fetchUsersByRegex } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import UserCard from "../cards/UserCard";

interface Props {
  userId: string;
}
const SearchBar = (userId: Props) => {
  interface SearchResult {
    id: string;
    name: string;
    username: string;
    image: string;

    // Add more properties as needed
  }

  console.log();

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (search.trim() === "") {
        setLoading(false);
      } else {
        setLoading(true); // Set loading state while fetching results

        try {
          handleSearch();
        } catch (error) {
          console.error("Error fetching search results:", error);
        } finally {
          setLoading(false); // Clear loading state
        }
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);
  const handleSearch = async () => {
    const res = await fetchUsersByRegex(search, userId?.userId); // Pass the user id as a string or an empty string if user is null
    setSearchResults(res); // Add type annotation to searchResults
  };
  return (
    <div className="mt-10">
      <form className="flex-center mx-auto w-full sm:-mt-10 sm:px-5">
        <label className="flex-center relative w-full max-w-5xl">
          <Image
            src="/magnifying-glass.svg"
            alt="search"
            width={25}
            height={25}
            className="absolute left-5 top-2"
          />
          <Input
            placeholder="Search for Users"
            className="base-regular h-fit border-0 bg-gray-800  pl-20 pr-8 text-white !ring-0 !ring-offset-0 placeholder:text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      </form>

      {/* Display loading indicator while searching */}
      {loading && <div className=" text-white">Loading...</div>}

      {/* Display search results */}
      <div className="mt-14 flex flex-col gap-9">
        {searchResults.length === 0 ? (
          <p className="no-result">Search For Users</p>
        ) : (
          <>
            {searchResults.map((person) => (
              <UserCard
                key={person.id}
                id={person.id}
                name={person.name}
                username={person.username}
                imgUrl={person.image}
                personType="User"
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
