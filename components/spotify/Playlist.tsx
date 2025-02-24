import Image from "next/image";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useSpotifyContext } from "../SpotifyContext";
import Song from "./Song";
import { twJoin } from "tailwind-merge";

import { ClockIcon } from "@heroicons/react/24/outline";
const Playlist = ({ width }: { width: number }) => {
  const { selectedPlaylist } = useSpotifyContext();
  return (
    <div className="w-full text-neutral-300 text-[.75rem]">
      <div className="border-b border-neutral-600 flex justify-between my-1 pb-2">
        <div className="flex flex-1 gap-4 place-items-center">
          <span className="w-10 text-right">#</span>
          <span className={twJoin("w-96", width <= 500 && "w-fit")}>Title</span>
        </div>

        {width > 650 && <span className="flex-1 text-left w-36">Album</span>}
        {width > 850 && (
          <span className="flex-1 text-left w-36">Date added</span>
        )}
        <span
          className={twJoin(
            "text-right w-fit mr-6",
            width < 650 && "flex justify-end flex-1"
          )}
        >
          <ClockIcon className="size-6" />
        </span>
      </div>
      <div className="flex flex-col gap-4 text-white mt-6">
        {selectedPlaylist?.map((song, idx) => (
          <Fragment key={song.track.id}>
            <Song order={idx} song={song} width={width} />
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default Playlist;
