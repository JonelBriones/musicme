"use client";
import spotifyApi from "@/lib/spotify";
import { useSession } from "next-auth/react";
import React, {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import useSpotify from "./hooks/useSpotify";
import { useSpotifyContext } from "./SpotifyContext";
import Image from "next/image";
import { twJoin } from "tailwind-merge";
import {
  MagnifyingGlassIcon,
  MusicalNoteIcon,
  Squares2X2Icon,
  ListBulletIcon,
  CheckIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import { redirect } from "next/navigation";

const Sidebar = () => {
  const { data: session } = useSession();
  const { getPlayListFromId, selectedPlaylist } = useSpotifyContext();
  const spotifyApi = useSpotify();
  const [playLists, setPlaylists] = useState([]);
  const [playList, setPlaylist] = useState([]);
  const [likedSong, setLikedSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      console.log("access token", spotifyApi._credentials);

      spotifyApi
        .getUserPlaylists()
        .then((data) => {
          setPlaylists(data.body.items);
          console.log("PLAYLIST", data.body.items);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          redirect("/login");
        });
    }
  }, [session, spotifyApi]);

  const [viewAs, setViewAs] = useState("list");
  const [squareSize, setSquareSize] = useState(120);
  const [squareRange, setSquareRange] = useState(0);

  const handleSquareSize = () => {
    if (squareRange <= 2) {
      console.log("returning 60");
      return 120;
    }

    if (squareRange > 2 && squareRange < 7) {
      console.log("returning 300");

      return 320;
    }

    if (squareRange >= 7) {
      console.log("returning 400");
      return 400;
    }
  };

  const [toggleLayout, setToggleLayout] = useState(false);
  const toggleLayoutRef = useRef(null);
  const toggleButtonRef = useRef(null);

  const handleCloseToggleLayout = useCallback((e) => {
    if (
      toggleLayoutRef.current &&
      !toggleLayoutRef.current.contains(e.target) && // Click outside div
      toggleButtonRef.current &&
      !toggleButtonRef.current.contains(e.target) // Click outside button
    ) {
      setToggleLayout(false);
    }
  });

  useEffect(() => {
    document.body.addEventListener("mousedown", handleCloseToggleLayout);
    return () => {
      document.body.removeEventListener("mousedown", handleCloseToggleLayout);
    };
  }, [handleCloseToggleLayout]);
  const [toggleSearch, setToggleSearch] = useState(false);

  return (
    <div className="flex flex-col overflow-auto backgroundContainer relative">
      <div className="flex justify-between  text-neutral-400 mx-2 py-2 ">
        <div className="flex  place-items-center w-4/5 relative">
          <div
            className={`absolute top-0 left-0 bottom-0 w-0 bg-neutral-600 sidebarSearch ${
              toggleSearch ? "w-full" : ""
            }`}
          />
          <MagnifyingGlassIcon
            className={`size-8 text-neutral-400 p-1 bg-transparent pl-2 z-10 rounded-full ${
              toggleSearch
                ? "z-1 cursor-text"
                : "hover:bg-neutral-600 cursor-pointer"
            }`}
            onClick={() => {
              !toggleSearch && setToggleSearch(!toggleSearch);
            }}
          />
          <input
            type="text"
            className={`${
              toggleSearch
                ? "absolute top-0 left-7"
                : "cursor-default opacity-0 w-0"
            } p-1 rounded-r-lg bg-transparent text-neutral-400 outline-none opacity-100`}
          />
        </div>
        <div className="flex place-items-center relative">
          <div
            ref={toggleButtonRef}
            className="hover:text-neutral-200 hover:text-[1.05rem] flex gap-2 z-10"
            onClick={() => {
              setToggleLayout(!toggleLayout);
            }}
          >
            <span className={`font-light ${toggleSearch ? "hidden" : ""}`}>
              Recents
            </span>
            {viewAs == "grid" ? (
              <Squares2X2Icon className=" size-6" />
            ) : viewAs == "list" ? (
              <ListBulletIcon className=" size-6" />
            ) : (
              <Bars3Icon className=" size-6" />
            )}
          </div>
          {toggleLayout && (
            <div
              ref={toggleLayoutRef}
              className="absolute -bottom-40 w-44 flex flex-col right-0 bg-[#3d3d3d] p-1 rounded-lg"
            >
              <span
                className="flex gap-3 justify-between hover:bg-neutral-600 bg-[#3d3d3d] p-3"
                onClick={() => setViewAs("compact")}
              >
                <div
                  className={twJoin(
                    viewAs == "compact" && "text-[#1ed760]",
                    "flex gap-3"
                  )}
                >
                  <Bars3Icon className=" size-6" />
                  <span>Compact</span>
                </div>
                {viewAs == "compact" && (
                  <CheckIcon className="size-6 text-[#1ed760]" />
                )}
              </span>
              <span
                className="flex gap-3 justify-between hover:bg-neutral-600 bg-[#3d3d3d] p-3"
                onClick={() => setViewAs("list")}
              >
                <div
                  className={twJoin(
                    viewAs == "list" && "text-[#1ed760]",
                    "flex gap-3"
                  )}
                >
                  <ListBulletIcon className=" size-6" />
                  <span>List</span>
                </div>
                {viewAs == "list" && (
                  <CheckIcon className="size-6 text-[#1ed760]" />
                )}
              </span>
              <span
                className="flex gap-3 justify-between hover:bg-neutral-600 bg-[#3d3d3d] p-3"
                onClick={() => setViewAs("grid")}
              >
                <div
                  className={twJoin(
                    viewAs == "grid" && "text-[#1ed760]",
                    "flex gap-3"
                  )}
                >
                  <Squares2X2Icon className=" size-6" />
                  <span>Grid</span>
                </div>
                {viewAs == "grid" && (
                  <CheckIcon className="size-6 text-[#1ed760]" />
                )}
              </span>
            </div>
          )}
        </div>
      </div>
      {loading ? (
        <div>loading...</div>
      ) : (
        <div className="flex flex-col gap-3 overflow-auto">
          {playLists.map((playList, idx) => {
            const { images, id, name } = playList;
            return (
              <div
                key={playList.id}
                className="flex gap-3 place-items-center cursor-pointer"
                onClick={() => getPlayListFromId(id)}
              >
                {viewAs !== "compact" &&
                  (images !== null ? (
                    <Image
                      height={viewAs == "list" ? 60 : handleSquareSize()}
                      width={viewAs == "list" ? 60 : handleSquareSize()}
                      alt={name + "_img"}
                      src={images?.[0]?.url}
                      className="rounded-md"
                    />
                  ) : (
                    // if no image is available
                    <div
                      className={twJoin(
                        `text-neutral-400 bg-neutral-800 flex justify-center place-items-center border`,
                        viewAs == "grid"
                          ? `w-[${handleSquareSize()}px] h-[60px] size-[${handleSquareSize()}] border-red-500`
                          : "w-[60px] h-[60px] "
                      )}
                    >
                      <MusicalNoteIcon className="text-neutral-400 size-7" />
                    </div>
                  ))}

                {/* compact and list view */}
                {viewAs !== "grid" && (
                  <p className="text-white text-[1rem]">{name}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
