import { signOut, useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import spotifyApi from "@/lib/spotify";
import { redirect } from "next/navigation";

const TopBar = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      console.log("access token", spotifyApi._credentials);
      if (spotifyApi._credentials == null) {
        console.log("need to redirect, access token expired");
        redirect("/login");
      }
    }
  }, [session, spotifyApi]);
  return (
    <div className="text-white flex justify-between place-items-center">
      <h1>
        {" "}
        Welcome {session?.user?.name ? session.user.name : "not logged in"}{" "}
      </h1>
      <div className="relative">
        <MagnifyingGlassIcon className="size-7 text-neutral-400 absolute top-[10px] left-2" />
        <input
          type="text"
          placeholder="What do you want to play?"
          className="p-2 py-3 pl-10 w-80 rounded-full bg-neutral-800 text-neutral-300 flex justify-start outline-white hover:bg-[#3c3c3c]"
        />
      </div>
      <button onClick={() => signOut()} className="flex">
        Log out
      </button>
    </div>
  );
};

export default TopBar;
