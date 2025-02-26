import React, { useState } from "react";
import { MusicalNoteIcon } from "@heroicons/react/24/solid";
import { PlayIcon } from "@heroicons/react/24/solid";
import { PauseIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

import { useSpotifyContext } from "../SpotifyContext";
import { twJoin } from "tailwind-merge";

const Song = ({ order, song, width }: any) => {
  const { selectedTrack, setSelectedTrack, getSelectedTrack } =
    useSpotifyContext();

  const { added_at } = song;
  //   const [currentTrackId, setCurrentTrackId] = useState(song.track.id);
  //   const [isPlaying, setIsPlaying] = useState(false);
  function timeSince(added_at: string) {
    const date = new Date(added_at).getTime();
    const now = new Date();
    const pastDate = new Date(new Date(date).getTime());
    const timeDifference = now.getTime() - pastDate.getTime();
    if (isNaN(timeDifference)) {
      return "Invalid date";
    }

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30.44); // Average days in a month
    const years = Math.floor(months / 12);

    if (years > 0) {
      return `${years} year${years > 1 ? "s" : ""} ago`;
    } else if (months > 0) {
      return `${months} month${months > 1 ? "s" : ""} ago`;
    } else if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else {
      return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
    }
  }
  function millisecondsToMinutesSeconds(milliseconds: number) {
    const minutes = Math.floor(milliseconds / (60 * 1000));
    const remainingMilliseconds = milliseconds % (60 * 1000);
    const seconds = Math.floor(remainingMilliseconds / 1000);

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }
  console.log(song);

  return (
    <div
      className={twJoin(
        "flex place-items-center text-neutral-400 rounded-md py-2",
        selectedTrack == song?.id ? "bg-neutral-500" : "hover:bg-neutral-700"
      )}
      onClick={() => setSelectedTrack(song.id)}
    >
      <div className="flex gap-4 place-items-center">
        <span className="text-right w-10">{order + 1}</span>
        <PlayIcon className="size-7 text-neutral-400" />

        <div
          className={twJoin(
            "flex place-items-center w-96 gap-3",
            width <= 500 && "w-fit"
          )}
        >
          {song?.album?.images !== null ? (
            <div>
              <Image
                height={40}
                width={40}
                alt={song?.name + "_img"}
                src={song?.album?.images?.[0]?.url}
                className="rounded-md min-w-[40px]"
              />
            </div>
          ) : (
            <div className="flex place-items-center justify-center bg-neutral-800 rounded-md h-[50px] w-[50px] ">
              <MusicalNoteIcon className="size-7 text-neutral-400" />
            </div>
          )}

          <div className="flex w-36 flex-col">
            <span className="text-white text-[.875rem] truncate">
              {song.name}
            </span>
            <span className="truncate">{song?.artists?.[0].name}</span>
          </div>
        </div>
      </div>

      {width > 650 && (
        <span className="text-left flex-1 w-36 truncate">
          {song?.album?.name}
        </span>
      )}

      {width > 850 && (
        <span className="text-left flex-1 w-36 ">{timeSince(added_at)}</span>
      )}
      <span
        className={twJoin(
          "text-right w-fit mr-6",
          width < 650 && "flex justify-end flex-1"
        )}
      >
        {millisecondsToMinutesSeconds(song?.duration_ms)}
      </span>
    </div>
  );
};

export default Song;
