import React, { useEffect, useState } from "react";
import useSpotify from "./useSpotify";
import { useSpotifyContext } from "../SpotifyContext";

const useSongInfo = () => {
  const spotifyApi = useSpotify();
  const { currentTrackId } = useSpotifyContext();

  const [songInfo, setSongInfo] = useState(null);
  useEffect(() => {
    const fetchSongInfo = async () => {
      if (currentTrackId) {
        console.log("making request to fetch track id");
        const trackInfo = await fetch(
          `https://api.spotify.com/v1/tracks/${currentTrackId}`,
          {
            headers: {
              Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
            },
          }
        ).then((res) => res.json());
        setSongInfo(trackInfo);
      }
    };
    fetchSongInfo();
  }, [currentTrackId, spotifyApi]);
  return songInfo;
};

export default useSongInfo;
