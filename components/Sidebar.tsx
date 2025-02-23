"use client";
import spotifyApi from "@/lib/spotify";
import { useSession } from "next-auth/react";
import React, { useContext, useEffect, useState } from "react";
import useSpotify from "./hooks/useSpotify";
import { useSpotifyContext } from "./SpotifyContext";

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
  return (
    <div className="flex flex-col w-[400px] backgroundContainer">
      {loading ? (
        <div>loading...</div>
      ) : (
        playLists.map((playList) => (
          <p
            key={playList.id}
            className="text-white"
            onClick={() => getPlayListFromId(playList.id)}
          >
            {playList.name}
          </p>
        ))
      )}
    </div>
  );
};

export default Sidebar;
