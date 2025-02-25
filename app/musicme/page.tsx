"use client";

import Playlist from "@/components/spotify/Playlist";
import { useSpotifyContext } from "@/components/SpotifyContext";
import React, { useRef } from "react";
import { Panel } from "react-resizable-panels";

const page = () => {
  const { selectedPlaylist } = useSpotifyContext();
  const panelRef = useRef(null);

  return <div>mUSIC ME</div>;
};

export default page;
