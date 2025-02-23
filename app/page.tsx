"use client";
import SpotifyPlayer from "@/components/SpotifyPlayer";
import { useSession } from "next-auth/react";
import Navbar from "../components/Navbar";
import Sidebar from "@/components/Sidebar";
import Main from "@/components/spotify/Main";
import TopBar from "@/components/spotify/TopBar";
import Player from "@/components/spotify/Player";
import useSpotify from "@/components/hooks/useSpotify";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

export default function Home() {
  const { data: session, status } = useSession();
  const spotifyApi = useSpotify();
  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      console.log("access token", spotifyApi?._credentials);
      if (!spotifyApi._credentials) {
        console.log("need to redirect, access token expired");
        redirect("/login");
      }
    } else {
      console.log("no entry");
    }
  }, [session, spotifyApi]);
  return (
    <div className="flex flex-col text-[1rem] h-screen p-4">
      <TopBar />
      <PanelGroup
        autoSaveId="example"
        direction="horizontal"
        className="flex gap-3 flex-grow overflow-hidden py-4"
      >
        <Panel id="sidebar" minSize={10} maxSize={25} order={1}>
          <Sidebar />
        </Panel>
        <PanelResizeHandle />
        <Panel id="main" minSize={60} order={2}>
          <Main />
        </Panel>
        <PanelResizeHandle />
      </PanelGroup>

      <Player />
    </div>
  );
}
