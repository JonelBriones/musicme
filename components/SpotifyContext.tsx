"use client";
import spotifyApi from "@/lib/spotify";
import { createContext, useContext, useState } from "react";
const ThemeContext = createContext(null);

const SpotifyContext = ({ children }: { children: React.ReactNode }) => {
  const [selectedPlaylist, setSelectedPlaylist] = useState<any | null>(null);
  const [currentTrackId, setCurrentTrackId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(null);
  const [viewPlaylist, setViewPlaylist] = useState(false);

  const getPlayListFromId = (id: string): any => {
    spotifyApi.getPlaylist(id).then((data) => {
      // console.log("finding playlist...", data);
      console.log();
      setSelectedPlaylist(data.body.tracks.items.slice(0, 10));
      setViewPlaylist(viewPlaylist);
    });
  };
  function playTrack(id: string) {
    spotifyApi.getPlaylist(id).then((data) => {
      // console.log("finding playlist...", data);
      setSelectedPlaylist(data.body.tracks.items.slice(0, 10));
    });
  }

  return (
    <ThemeContext.Provider
      value={{
        selectedPlaylist,
        getPlayListFromId,
        setCurrentTrackId,
        currentTrackId,
        setIsPlaying,
        isPlaying,
        viewPlaylist,
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
