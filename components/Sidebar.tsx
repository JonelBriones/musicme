"use client";
import spotifyApi from "@/lib/spotify";
import { useSession } from "next-auth/react";
import React, { useContext, useEffect, useState } from "react";
import useSpotify from "./hooks/useSpotify";
import { useSpotifyContext } from "./SpotifyContext";
import Image from "next/image";
import { twJoin } from "tailwind-merge";
import { MusicalNoteIcon } from "@heroicons/react/24/solid";
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
      spotifyApi.getUserPlaylists().then((data) => {
        setPlaylists(data.body.items);
        setLoading(false);
      });
    }
  }, [session, spotifyApi]);

  console.log(playLists);
  console.log("playlist on click", playList);
  console.log("found playlist", selectedPlaylist);
  const [viewAs, setViewAs] = useState("list");
  const image = {
    grid: 300,
    list: 60,
  };
  return (
    <div className="flex flex-col w-[400px] backgroundContainer">
      <p className="text-white text-4xl">{viewAs}</p>
      <div>
        <button
          onClick={() => setViewAs("list")}
          className="p-2 text-white bg-green-300 border cursor-pointer"
        >
          list
        </button>
        <button
          onClick={() => setViewAs("compact")}
          className="p-2 text-white bg-green-300 border"
        >
          compact
        </button>
        <button
          onClick={() => setViewAs("grid")}
          className="p-2 text-white bg-green-300 border"
        >
          grid
        </button>
      </div>

      {loading ? (
        <div>loading...</div>
      ) : (
        <div className="flex flex-col gap-3 overflow-auto">
          {playLists.map((playList, idx) => {
            const { images, id, name } = playList;
            return (
              <div
                key={id}
                className="flex gap-3 place-items-center cursor-pointer"
              >
                {viewAs !== "compact" &&
                  (images !== null ? (
                    <Image
                      height={viewAs == "list" ? 60 : 300}
                      width={viewAs == "list" ? 60 : 300}
                      alt={name + "_img"}
                      src={images?.[0]?.url}
                      className="rounded-md"
                    />
                  ) : (
                    <div
                      className={twJoin(
                        viewAs == "list"
                          ? "h-[60px] w-[60px]"
                          : "h-[300px] w-[300px]",
                        "flex place-items-center justify-center bg-neutral-800 rounded-md"
                      )}
                    >
                      <MusicalNoteIcon className=" size-7 text-neutral-400" />
                    </div>
                  ))}
                <p
                  className="text-white text-[1rem]"
                  onClick={() => getPlayListFromId(id)}
                >
                  {name}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
