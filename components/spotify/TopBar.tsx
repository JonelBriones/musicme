"use client";
import { signOut, useSession } from "next-auth/react";
import React, { useEffect, useRef } from "react";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/solid";
import { HomeIcon } from "@heroicons/react/24/outline";
import { GlobeAltIcon } from "@heroicons/react/24/solid";
import spotifyApi from "@/lib/spotify";
import { redirect } from "next/navigation";
import Link from "next/link";
import { twJoin } from "tailwind-merge";

const TopBar = () => {
  const { data: session } = useSession();
  const searchRef = useRef(null);
  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      console.log("access token", spotifyApi._credentials);
      if (spotifyApi._credentials == null) {
        console.log("need to redirect, access token expired");
        redirect("/login");
      }
    }
  }, [session, spotifyApi]);

  const handleSearchFocus = () => {
    if (searchRef.current) {
      searchRef.current.focus();
      searchRef.current == true;
      console.log(searchRef?.current.value);
    } else {
      searchRef.current.value == false;
      console.log(searchRef?.current.value);
    }
  };

  return (
    <div className="text-white flex justify-between place-items-center">
      <h1>
        {" "}
        Welcome {session?.user?.name ? session.user.name : "not logged in"}{" "}
      </h1>
      <div className="flex gap-2 place-items-center">
        <button>RECOMMEND</button>
        <Link
          href={"/"}
          className="flex place-items-center bg-neutral-800 hover:bg-neutral-800/95 p-6 rounded-full justify-center transition-colors duration-200 relative ease-in-out"
        >
          <HomeIcon className="w-full h-full p-3 hover:p-[.725rem] absolute top-0 left-0 text-neutral-400 hover:text-neutral-200 transition-all duration-100 ease-in-out" />
        </Link>
        <div className="relative">
          <button
            className={twJoin(
              "absolute top-0 left-0 flex place-items-center bottom-0 justify-center rounded-l-full",
              searchRef?.current?.value == true &&
                "hover:text-neutral-200 border"
            )}
          >
            <MagnifyingGlassIcon
              className={twJoin(
                "p-3 h-full text-neutral-400   rounded-l-full",
                searchRef?.current?.value == true && "hover:text-neutral-200 "
              )}
              onClick={() => handleSearchFocus()}
            />
          </button>
          <input
            ref={searchRef}
            type="text"
            placeholder="What do you want to play?"
            className="p-3 pl-12 w-80 rounded-full bg-neutral-800 text-neutral-300 flex justify-start outline-white hover:bg-[#3c3c3c] transition-colors duration-200"
          />
        </div>
        <Link
          href={"/browse"}
          className="flex place-items-center bg-neutral-800 hover:bg-neutral-800/95 p-6 rounded-full justify-center transition-colors duration-200 relative ease-in-out"
        >
          <GlobeAltIcon className="w-full h-full p-3 hover:p-[.725rem] absolute top-0 left-0 text-neutral-400 hover:text-neutral-200 transition-all duration-100 ease-in-out" />
        </Link>
        <Link
          href={"/browse"}
          className="flex place-items-center bg-neutral-800 hover:bg-neutral-800/95 p-6 rounded-full justify-center transition-colors duration-200 relative ease-in-out"
        >
          <PlusIcon className="w-full h-full p-3 hover:p-[.725rem] absolute top-0 left-0 text-neutral-400 hover:text-neutral-200 transition-all duration-100 ease-in-out" />
        </Link>
      </div>
      <button onClick={() => signOut()} className="flex">
        Log out
      </button>
    </div>
  );
};

export default TopBar;
