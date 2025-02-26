"use client";

import { useSpotifyContext } from "@/components/SpotifyContext";
import React, { useRef } from "react";
import { Panel } from "react-resizable-panels";

const page = () => {
  const { selectedPlaylist } = useSpotifyContext();
  return <div>mUSIC ME</div>;
};

export default page;
