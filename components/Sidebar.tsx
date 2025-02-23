"use client";
import spotifyApi from "@/lib/spotify";
import { useSession } from "next-auth/react";
import React, { Fragment, useContext, useEffect, useState } from "react";
import useSpotify from "./hooks/useSpotify";
import { useSpotifyContext } from "./SpotifyContext";
import Image from "next/image";
import { twJoin } from "tailwind-merge";
import { MusicalNoteIcon } from "@heroicons/react/24/solid";
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
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          redirect("/login");
        });
    }
  }, [session, spotifyApi]);

  const [viewAs, setViewAs] = useState("list");
  const [gridSize, setGridSize] = useState(60);

  return (
    <div className="flex flex-col min-w-[120px] w-[400px] overflow-auto backgroundContainer">
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
                key={playList.id}
                className="flex gap-3 place-items-center cursor-pointer"
                onClick={() => getPlayListFromId(id)}
              >
                {viewAs !== "compact" &&
                  (images !== null ? (
                    <Image
                      height={viewAs == "list" ? 60 : gridSize}
                      width={viewAs == "list" ? 60 : gridSize}
                      alt={name + "_img"}
                      src={images?.[0]?.url}
                      className="rounded-md"
                    />
                  ) : (
                    <div className="flex place-items-center justify-center bg-neutral-800 rounded-md h-[60px] w-[60px]">
                      <MusicalNoteIcon className=" size-7 text-neutral-400" />
                    </div>
                  ))}
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
