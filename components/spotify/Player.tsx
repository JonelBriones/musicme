import React, { useCallback, useEffect, useState } from "react";
import useSongInfo from "../hooks/useSongInfo";
import useSpotify from "../hooks/useSpotify";
import { useSpotifyContext } from "../SpotifyContext";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { MusicalNoteIcon, PauseIcon } from "@heroicons/react/24/solid";
import { PlayIcon } from "@heroicons/react/24/solid";
import { ForwardIcon } from "@heroicons/react/24/solid";
import { BackwardIcon } from "@heroicons/react/24/solid";
import { SpeakerWaveIcon } from "@heroicons/react/24/solid";
import { SpeakerXMarkIcon } from "@heroicons/react/24/solid";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { QueueListIcon } from "@heroicons/react/24/solid";
import { PlusCircleIcon } from "@heroicons/react/24/solid";

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
    console.log("running fetch current track");
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        console.log("current track", data);
        setCurrentTrackId(data.body?.item?.id);
        console.log();
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          console.log("current playback state", data);
          setIsPlaying(data.body?.is_playing);
        });
      });
    }
  };
  useEffect(() => {
    console.log("song info updated", songInfo);
  }, [songInfo, spotifyApi]);

  const handlePlayPause = () => {
    // check if a song is currently playing,
    // if song is currently playing, set new

    if (songInfo) {
      spotifyApi.getMyCurrentPlaybackState().then((data) => {
        console.log("current playback state", data);
        console.log(data);
        if (data.body?.is_playing) {
          spotifyApi.pause();
          setIsPlaying(false);
        } else {
          spotifyApi.play();
          setIsPlaying(true);
        }
      });
    }
  };
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const handleSkipPrevious = async () => {
    setIsPlaying(false);
    if (songInfo) {
      spotifyApi.skipToPrevious();
      await sleep(1000);
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        setCurrentTrackId(data.body?.item?.id);
        setIsPlaying(true);
      });
    }
  };
  const handleSkipNext = async () => {
    setIsPlaying(false);
    if (songInfo) {
      spotifyApi.skipToNext();
      await sleep(1000);
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        setCurrentTrackId(data.body?.item?.id);
        setIsPlaying(true);
      });
    }
  };
  const handleShuffle = () => {
    if (songInfo) {
      spotifyApi.getMyCurrentPlaybackState().then((data) => {
        console.log("current playback state", data);
        if (data.body?.is_playing) {
          // spotifyApi.setShuffle();
        }
      });
    }
  };

  const handleRepeat = () => {
    console.log("go to next song");
    if (songInfo) {
      spotifyApi.getMyCurrentPlaybackState().then((data) => {
        console.log("current playback state", data);
        console.log(data);
        if (data.body?.is_playing) {
          spotifyApi.setRepeat(songInfo);
        }
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

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debounceAdjustVolume(volume);
    }
  }, [volume]);

  function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, 500);
    };
  }
  const debounceAdjustVolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume).catch((error) => {});
    }, 500),
    []
  );
  return (
    <div className="flex place-items-center text-neutral-400 min-w-screen-md">
      <div className="flex flex-1 gap-4">
        <div className="shrink-0">
          {songInfo?.album?.images !== null &&
          songInfo?.album?.images?.[0]?.url ? (
            <Image
              height={60}
              width={60}
              alt={songInfo?.name + "_img"}
              src={songInfo?.album?.images?.[0]?.url}
              className="rounded-md min-w-[40px]"
            />
          ) : (
            <div className="flex place-items-center justify-center bg-neutral-800 rounded-md h-[60px] w-[60px] ">
              <MusicalNoteIcon className=" size-7 text-neutral-400" />
            </div>
          )}
        </div>
        <div className="flex shrink flex-col justify-center max-w-60">
          <span className="text-white truncate">{songInfo?.name}</span>
          <span className="text-[.875rem] truncate">
            {songInfo?.album?.artists?.[0]?.name}
          </span>
        </div>
      </div>
      <div className="flex justify-center shrink-0 gap-4 w-60">
        <BackwardIcon
          className=" size-7 text-neutral-400"
          onClick={handleSkipPrevious}
        />
        {isPlaying ? (
          <PauseIcon
            className=" size-7 text-neutral-400"
            onClick={handlePlayPause}
          />
        ) : (
          <PlayIcon
            className=" size-7 text-neutral-400"
            onClick={handlePlayPause}
          />
        )}
        <ForwardIcon
          className=" size-7 text-neutral-400"
          onClick={handleSkipNext}
        />
        <ArrowPathIcon
          className=" size-7 text-neutral-400"
          onClick={handleRepeat}
        />
      </div>
      <div className="flex-1 flex gap-2 justify-center shrink-0">
        {volume > 0 ? (
          <SpeakerWaveIcon className=" size-7 text-neutral-400" />
        ) : (
          <SpeakerXMarkIcon className=" size-7 text-neutral-400" />
        )}
        <div>
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="border"
          />
        </div>
      </div>
    </div>
  );
};

export default Player;
