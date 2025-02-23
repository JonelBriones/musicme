import { useSession } from "next-auth/react";
import React from "react";
import { useSpotifyContext } from "../SpotifyContext";

const Main = () => {
  const { data: session } = useSession();
  const { selectedPlaylist } = useSpotifyContext();

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

  return (
    <div className="flex-1 backgroundContainer text-white w-full">
      {/* SELECTED PLAYLIST */}
      <div className="m-6">
        <div className="border-b -neutral-400 flex justify-between py-2 px-5">
          <div className="flex gap-4 flex-1  place-items-center">
            <span>#</span>
            <span className="">Title</span>
          </div>
          <span className="flex-1 text-left ">Album</span>
          <span className="flex-1 text-left ">Date added</span>
          <span className="text-right w-[70px] ">Time</span>
        </div>
        <div className="flex flex-col gap-4 p-5">
          {selectedPlaylist?.map(({ added_at, track }, idx) => {
            const { id, name, artists, album } = track;
            return (
              <div className="text-white flex place-items-center" key={id}>
                <div className="flex gap-4 flex-1  place-items-center">
                  <span>{idx}</span>
                  <span
                    className="flex flex-col
                  "
                  >
                    <span className="">{name}</span>
                    <span>{artists[0].name}</span>
                  </span>
                </div>

                <span className="flex-1 ">{album.name}</span>
                <span className="flex-1 ">{timeSince(added_at)}</span>

                <span className="w-[70px]  text-right">
                  {millisecondsToMinutesSeconds(track.duration_ms)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Main;
