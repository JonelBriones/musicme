import React, { useEffect, useState } from "react";
import useSongInfo from "../hooks/useSongInfo";
import useSpotify from "../hooks/useSpotify";
import { useSpotifyContext } from "../SpotifyContext";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { MusicalNoteIcon } from "@heroicons/react/24/solid";

const Player = () => {
  const { data: session } = useSession();
  const songInfo = useSongInfo();

  const spotifyApi = useSpotify();
  const { currentTrackId, setCurrentTrackId, setIsPlaying, isPlaying } =
    useSpotifyContext();
  const [volume, setVolume] = useState(50);
  const [loading, setLoading] = useState(true);
  const fetchCurrentTrack = () => {
    // check if a song is currently playing,
    // if song is currently playing, set new
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        console.log("current track", data);
        setCurrentTrackId(data.body?.item?.id);

        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          console.log("current playback state", data);
          setIsPlaying(data.body?.is_playing);
        });
      });
    }
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentTrack(); // when a song plays this will run on client refresh
      setVolume(50);
      setLoading(false);
    }
  }, [currentTrackId, spotifyApi, session]);
  console.log("song info", songInfo);
  console.log("SONG PLAYING", isPlaying);

  return (
    <div className="flex justify-between place-items-center p-4 text-neutral-400">
      <div className="flex gap-4">
        {songInfo?.album?.images !== null &&
        songInfo?.album?.images?.[0]?.url ? (
          <Image
            height={60}
            width={60}
            alt={songInfo?.album?.name + "_img"}
            src={songInfo?.album?.images?.[0]?.url}
            className="rounded-md min-w-[40px]"
          />
        ) : (
          <div className="flex place-items-center justify-center bg-neutral-800 rounded-md h-[60px] w-[60px] ">
            <MusicalNoteIcon className=" size-7 text-neutral-400" />
          </div>
        )}
        <div className="flex flex-col justify-center">
          <span>{songInfo?.album?.name}</span>
          <span className="text-white text-[.875rem] truncate">
            {songInfo?.album?.artists?.[0]?.name}
          </span>
        </div>
      </div>
      <div>controls</div>
      <div>volume</div>
    </div>
  );
};

export default Player;
