import { useSession } from "next-auth/react";
import React, { Fragment, useEffect, useState } from "react";
import { useSpotifyContext } from "../SpotifyContext";
import Image from "next/image";
import { MusicalNoteIcon } from "@heroicons/react/24/solid";
import Song from "./Song";
import Playlist from "./Playlist";

const Main = () => {
  const { data: session } = useSession();

  const { selectedPlaylist } = useSpotifyContext;

  console.log("main", selectedPlaylist);
  return (
    <div className="w-full h-full inline-flex text-white backgroundContainer">
      {selectedPlaylist !== null ||
        (selectedPlaylist !== undefined && <Playlist />)}
    </div>
  );
};

export default Main;
