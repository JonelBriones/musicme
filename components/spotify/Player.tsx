"use client";
import React, { useCallback, useEffect, useState } from "react";
import useSpotify from "../hooks/useSpotify";
import { useSpotifyContext } from "../SpotifyContext";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { MusicalNoteIcon } from "@heroicons/react/24/solid";
import { PlayCircleIcon } from "@heroicons/react/24/solid";
import { PauseCircleIcon } from "@heroicons/react/24/solid";
import { ForwardIcon } from "@heroicons/react/24/solid";
import { BackwardIcon } from "@heroicons/react/24/solid";
import { SpeakerWaveIcon } from "@heroicons/react/24/solid";
import { SpeakerXMarkIcon } from "@heroicons/react/24/solid";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { QueueListIcon } from "@heroicons/react/24/solid";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/solid";
import spotifyApi from "@/lib/spotify";
import { twJoin } from "tailwind-merge";

const Player = () => {
  const { data: session } = useSession();
  // const songInfo = useSongInfo();

  // const spotifyApi = useSpotify();

  const {
    currentTrackId,
    setCurrentTrackId,
    setIsPlaying,
    isPlaying,
    songInfo,
    fetchCurrentTrack,
  } = useSpotifyContext();
  const [volume, setVolume] = useState(20);
  const [seek, setSeek] = useState(0);
  const [loading, setLoading] = useState(true);
  const [repeatTrack, setRepeatTrack] = useState("off");
  const repeatOptions = ["off", "context", "track"];

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  useEffect(() => {
    // get current track on first render
    if (spotifyApi.getAccessToken() && !currentTrackId && !songInfo) {
      fetchCurrentTrack();
      setLoading(false);
    }
    if (songInfo) {
      setIsPlaying(songInfo.is_playing);
      setSeek(songInfo.progress_ms / 1000);
      setSeconds(songInfo.progress_ms / 1000);
      console.log(songInfo.repeat_state);
      setRepeatTrack(songInfo.repeat_state);
    }
  }, [currentTrackId, spotifyApi, session, songInfo]);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    // console.log("is playing?", isPlaying ? "true" : "false");

    const time = Math.round((seconds * 10) / 10);
    const trackTotalSeconds = Math.round(
      ((songInfo?.item.duration_ms / 1000) * 10) / 10
    );

    if (!isPlaying) return;
    if (isPlaying && time >= trackTotalSeconds - 1) {
      setSeconds(0);
      fetchCurrentTrack();
      handleSecondsRestart();
    }
    let intervalId: NodeJS.Timeout;

    intervalId = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [seconds, isPlaying]);

  const handleSecondsRestart = async () => {
    await sleep(4000);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      spotifyApi.pause();
      setIsPlaying(false);
    } else {
      spotifyApi.play();
      setIsPlaying(true);
    }
  };

  const handleSkipPrevious = async () => {
    if (songInfo) {
      setSeconds(0);
      spotifyApi.skipToPrevious();
      await sleep(2000);
      fetchCurrentTrack();
    }
  };
  const handleSkipNext = async () => {
    const skip = async () => {
      await sleep(1000);
      spotifyApi.skipToNext();
    };

    if (songInfo) {
      setSeconds(0);
      spotifyApi.skipToNext();
      fetchCurrentTrack();
    }
  };
  const handleShuffle = () => {
    if (songInfo) {
      spotifyApi.getMyCurrentPlaybackState().then((data) => {
        if (data.body?.is_playing) {
          // spotifyApi.setShuffle();
        }
      });
    }
  };
  useEffect(() => {}, [repeatTrack]);
  const handleRepeat = (option) => {
    spotifyApi.setRepeat(option);
  };

  function millisecondsToMinutesSeconds(milliseconds: number) {
    const minutes = Math.floor(milliseconds / (60 * 1000));
    const remainingMilliseconds = milliseconds % (60 * 1000);
    const seconds = Math.floor(remainingMilliseconds / 1000);

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  useEffect(() => {
    if (volume >= 0 && volume < 100) {
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

  useEffect(() => {
    if (seek > 0 && seek < songInfo?.item.duration_ms / 1000) {
      debounceSeek(seek);
    }
  }, [seek]);

  const debounceSeek = useCallback(
    debounce((seek) => {
      spotifyApi.seek(seek * 1000).catch((error) => {});
    }, 1000),
    []
  );

  return (
    <div className="flex place-items-center text-neutral-400 min-w-screen-md">
      <div className="flex flex-1 gap-4">
        <div className="shrink-0">
          {songInfo?.item.album?.images !== null &&
          songInfo?.item.album?.images?.[0]?.url ? (
            <Image
              height={60}
              width={60}
              alt={songInfo?.item.name + "_img"}
              src={songInfo?.item.album?.images?.[0]?.url}
              className="rounded-md min-w-[40px]"
            />
          ) : (
            <div className="flex place-items-center justify-center bg-neutral-800 rounded-md h-[60px] w-[60px] ">
              <MusicalNoteIcon className=" size-7 text-neutral-400" />
            </div>
          )}
        </div>
        <div className="flex shrink flex-col justify-center max-w-60">
          <span className="text-white truncate">{songInfo?.item.name}</span>
          <span className="text-[.875rem] truncate">
            {songInfo?.item.album?.artists?.[0]?.name}
          </span>
        </div>
      </div>
      <div className="flex flex-col justify-center gap-3">
        <div className="flex justify-center place-items-center shrink-0 gap-4">
          <ArrowsRightLeftIcon
            className=" size-6 text-neutral-400"
            onClick={handleShuffle}
          />
          <BackwardIcon
            className=" size-6 text-neutral-400"
            onClick={handleSkipPrevious}
          />
          {isPlaying ? (
            <PauseCircleIcon
              className=" size-10 text-neutral-400"
              onClick={handlePlayPause}
            />
          ) : (
            <PlayCircleIcon
              className=" size-10 text-neutral-400"
              onClick={handlePlayPause}
            />
          )}
          <ForwardIcon
            className=" size-6 text-neutral-400"
            onClick={handleSkipNext}
          />
          <span className="relative">
            <ArrowPathIcon
              className={twJoin(
                "size-6 z-10 sticky ",
                repeatTrack == "off"
                  ? "text-neutral-400 hover:text-neutral-300"
                  : "text-[#1ed760]"
              )}
              onClick={() => {
                if (repeatTrack == "off") {
                  setRepeatTrack("context");
                  handleRepeat("context");
                }
                if (repeatTrack == "context") {
                  setRepeatTrack("track");
                  handleRepeat("track");
                }
                if (repeatTrack == "track") {
                  setRepeatTrack("off");
                  handleRepeat("off");
                }
              }}
            />
            {repeatTrack == "context" && (
              <span className="bg-[#1ed760] w-[5px] h-[5px] rounded-full absolute -bottom-2 left-0 right-0 m-auto" />
            )}
            {repeatTrack == "track" && (
              <>
                <span
                  className="text-[#1ed760] absolute text-sm left-2 top-[1.5px]"
                  onClick={() => console.log(1)}
                >
                  1
                </span>
                <span className="bg-[#1ed760] w-[5px] h-[5px] rounded-full absolute -bottom-2 left-0 right-0 m-auto " />
              </>
            )}
          </span>
        </div>
        <div className="text-[0.875rem] flex place-items-center gap-2">
          {/* {songInfo && <span>{millisecondsToMinutesSeconds(seek * 1000)}</span>} */}
          {songInfo && (
            <span>{millisecondsToMinutesSeconds(seconds * 1000)}</span>
          )}
          <input
            type="range"
            min={0}
            max={(songInfo?.item.duration_ms / 1000).toString()}
            value={songInfo ? seek : 0}
            step={0.01}
            onChange={(e) => {
              setSeek(Number(e.target.value));
              setSeconds(Number(e.target.value));
            }}
            className="w-80 disabled:"
            disabled={!songInfo}
          />
          {songInfo && (
            <span>
              {millisecondsToMinutesSeconds(songInfo?.item.duration_ms)}
            </span>
          )}
        </div>
      </div>
      <div className="flex-1 flex gap-2 justify-center shrink-0">
        {volume > 0 ? (
          <SpeakerWaveIcon
            className=" size-7 text-neutral-400"
            onClick={() => setVolume(0)}
          />
        ) : (
          <SpeakerXMarkIcon
            className=" size-7 text-neutral-400"
            onClick={() => setVolume(50)}
          />
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
