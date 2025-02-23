import { useSession } from "next-auth/react";
import React, { Fragment, useEffect, useState } from "react";
import { useSpotifyContext } from "../SpotifyContext";
import Image from "next/image";
import { MusicalNoteIcon } from "@heroicons/react/24/solid";
import Song from "./Song";
import Playlist from "./Playlist";
import { Panel } from "react-resizable-panels";

const Main = () => {
  const { data: session } = useSession();

  const { selectedPlaylist } = useSpotifyContext();

  console.log("main", typeof selectedPlaylist, selectedPlaylist);
  return (
    <Panel id="main" minSize={35} order={2}>
      <div className="w-full h-full inline-flex text-white backgroundContainer">
        {selectedPlaylist !== null && <Playlist />}
      </div>
    </Panel>
  );
};

export default Main;
