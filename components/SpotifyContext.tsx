"use client";
import spotifyApi from "@/lib/spotify";
import { createContext, useContext, useState } from "react";
const ThemeContext = createContext(null);

const SpotifyContext = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState<any>(undefined);
  const [currentTrackId, setCurrentTrackId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(null);

  const read = "reading from spotify";
  const getPlayListFromId = (id: string): any => {
    spotifyApi.getPlaylist(id).then((data) => {
      console.log("finding playlist...", data);
      setSelectedPlaylist(data.body.tracks.items.slice(0, 10));
    });
  };
  function playTrack(id: string) {
    spotifyApi.getPlaylist(id).then((data) => {
      console.log("finding playlist...", data);
      setSelectedPlaylist(data.body.tracks.items.slice(0, 10));
    });
  }
  console.log("current track", currentTrackId);
  return (
    <ThemeContext.Provider
      value={{
        selectedPlaylist,
        getPlayListFromId,
        read,
        setCurrentTrackId,
        currentTrackId,
        setIsPlaying,
        isPlaying,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default SpotifyContext;

export function useSpotifyContext() {
  return useContext(ThemeContext);
}
