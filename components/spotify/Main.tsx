import { useSession } from "next-auth/react";
import React, { Fragment, useEffect, useState } from "react";
import { useSpotifyContext } from "../SpotifyContext";
import Image from "next/image";
import { MusicalNoteIcon } from "@heroicons/react/24/solid";
import Song from "./Song";
import Playlist from "./Playlist";

const Main = () => {
  const { data: session } = useSession();

  return <Playlist />;
};

export default Main;
