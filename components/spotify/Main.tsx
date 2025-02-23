import { useSession } from "next-auth/react";
import React, { Fragment, useEffect, useState } from "react";
import { useSpotifyContext } from "../SpotifyContext";
import Image from "next/image";
import { MusicalNoteIcon } from "@heroicons/react/24/solid";
import Song from "./Song";
import Playlist from "./Playlist";
import { Panel } from "react-resizable-panels";
import { useMediaQuery } from "usehooks-ts";

const Main = () => {
  const { data: session } = useSession();

  const { selectedPlaylist } = useSpotifyContext();

  const isMobile = useMediaQuery("(max-width: 767px");
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px");
  const isDesktop = useMediaQuery("(min-width: 1024px");
  useEffect(() => {
    console.log("mobile", isMobile);
    console.log("tablet", isTablet);
    console.log("desktpo", isDesktop);
  }, []);

  const mobileMaxSize = () => {
    if (isMobile || isTablet) return 50;
    if (isDesktop) return 25;
  };

  return (
    <Panel id="main" order={2} minSize={mobileMaxSize()}>
      <div className="w-full h-full inline-flex text-white backgroundContainer">
        {selectedPlaylist !== null && <Playlist />}
      </div>
    </Panel>
  );
};

export default Main;
