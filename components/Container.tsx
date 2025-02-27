"use client";
import React, { Fragment, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import Sidebar from "@/components/Sidebar";
import useSpotify from "@/components/hooks/useSpotify";
import { useEffect } from "react";
import { redirect, usePathname } from "next/navigation";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useMediaQuery } from "usehooks-ts";
import Player from "./spotify/Player";
import TopBar from "./spotify/TopBar";
import spotifyApi from "@/lib/spotify";
const Container = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  //   const spotifyApi = useSpotify();
  const pathname = usePathname();
  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      if (!spotifyApi._credentials) {
        console.log("need to redirect, access token expired");
        redirect("/login");
      }
    }
  }, [session, spotifyApi]);

  const isMobile = useMediaQuery("(max-width: 767px");
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px");
  const isDesktop = useMediaQuery("(min-width: 1024px");
  const mobileMaxSize = () => {
    if (isMobile || isTablet) return 50;
    if (isDesktop) return 30;
  };

  if (pathname == "/login") {
    return <div> {children}</div>;
  }

  return (
    <div className="flex flex-col text-[1rem] h-screen p-4 w-full">
      <TopBar />
      <PanelGroup
        autoSaveId="example"
        direction="horizontal"
        className="flex gap-1 flex-grow overflow-hidden py-4"
      >
        <Sidebar />
        <PanelResizeHandle />

        <Panel id="main" order={2} minSize={mobileMaxSize()} className="">
          {children}
          <PanelResizeHandle />
        </Panel>
      </PanelGroup>
      <Player />
    </div>
  );
};

export default Container;
