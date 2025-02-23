"use client";
import SpotifyPlayer from "@/components/SpotifyPlayer";
import { useSession } from "next-auth/react";
import Navbar from "../components/Navbar";
import Sidebar from "@/components/Sidebar";
import Main from "@/components/spotify/Main";
import TopBar from "@/components/spotify/TopBar";
import Player from "@/components/spotify/Player";

export default function Home() {
  const { data: session } = useSession();
  console.log(session);

  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <div className="h-screen flex gap-3">
        <Sidebar />
        <Main />
      </div>

      <Player />
      {/* <SpotifyPlayer /> */}
    </div>
  );
}
