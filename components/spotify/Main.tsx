import { useSession } from "next-auth/react";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useSpotifyContext } from "../SpotifyContext";
import Playlist from "./Playlist";
import { Panel } from "react-resizable-panels";
import { useMediaQuery } from "usehooks-ts";

const Main = () => {
  const { data: session } = useSession();

  const { selectedPlaylist } = useSpotifyContext();

  const isMobile = useMediaQuery("(max-width: 767px");
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px");
  const isDesktop = useMediaQuery("(min-width: 1024px");
  const mobileMaxSize = () => {
    if (isMobile || isTablet) return 50;
    if (isDesktop) return 30;
  };
  const panelRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!panelRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      setWidth(width);
    });

    observer.observe(panelRef.current);

    return () => {
      if (panelRef.current) {
        observer.unobserve(panelRef.current);
      }
    };
  }, []);
  return (
    <Panel id="main" order={2} minSize={mobileMaxSize()}>
      <div
        className="w-full h-full inline-flex text-white backgroundContainer"
        ref={panelRef}
      >
        {selectedPlaylist !== null && <Playlist width={width} />}
      </div>
    </Panel>
  );
};

export default Main;
