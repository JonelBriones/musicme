import React, { useEffect, useState } from "react";
import useSpotify from "./useSpotify";
import useSongInfo from "./useSongInfo";
import SpotifyContext, { useSpotifyContext } from "../SpotifyContext";
import { getLyrics } from "@/app/api/lyrics/lyrics";

export const useData = () => {
  const spotifyApi = useSpotify();
  const selectedSong = useSongInfo();
  const { currentTrackId } = useSpotifyContext();
  const [songData, setSongData] = useState({
    title: "",
    artist: "",
    // genres: [],
    // danceability: 0,
    // energy: 0,
    // mood: "",
    lyrics: "",
  });
  /* 

select song 
   -> get audio features,
   -> get song.artist : https://api.spotify.com/v1/artists/${}


*/ console.log("finding current song data");

  useEffect(() => {
    console.log("id:", selectedSong);
    const fetchSongInfo = async () => {
      if (selectedSong) {
        console.log("fetching audio features");
        const trackInfo = await fetch(
          `https://api.spotify.com/v1/artists/${selectedSong.artists[0].id}`,
          {
            headers: {
              Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
            },
          }
        ).then((res) => res.json());
        const categories = await fetch(
          `https://api.spotify.com/v1/browse/categories`,
          {
            headers: {
              Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
            },
          }
        ).then((res) => res.json());
        const lyrics = await getLyrics(
          selectedSong.artists[0]?.name,
          selectedSong?.name
        );
        console.log("lyrics", lyrics);

        console.log("CATEGORIES", categories);
        console.log("TRACK INFO", trackInfo);
        setSongData({ ...songData, trackInfo });
      }
    };
    fetchSongInfo();
  }, [selectedSong]);
  return songData;
};
