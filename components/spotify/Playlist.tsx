import Image from "next/image";
import React, { Fragment } from "react";
import { MusicalNoteIcon } from "@heroicons/react/24/solid";
import { useSpotifyContext } from "../SpotifyContext";
import Song from "./Song";

const Playlist = () => {
  const { selectedPlaylist } = useSpotifyContext();
  console.log(selectedPlaylist);
  return (
    <div className="w-full text-neutral-300 text-[.75rem]">
      {/* SELECTED PLAYLIST */}

      <div className="border-b border-neutral-600 flex justify-between my-1 pb-2">
        <div className="flex flex-1 gap-4 place-items-center">
          <span className="w-10 text-right">#</span>
          <span className="w-96">Title</span>
        </div>
        <span className="flex-1 text-left w-36">Album</span>
        <span className="flex-1 text-left w-36">Date added</span>
        <span className="text-right w-[70px] mr-6">Time</span>
      </div>
      <div className="flex flex-col gap-4 text-white mt-6">
        {selectedPlaylist?.map((song, idx) => (
          <Fragment key={song.track.id}>
            <Song order={idx} song={song} />
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default Playlist;
