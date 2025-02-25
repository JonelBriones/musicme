"use client";
import useSpotify from "@/components/hooks/useSpotify";
import Song from "@/components/spotify/Song";
import { useSpotifyContext } from "@/components/SpotifyContext";
import { ClockIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { twJoin } from "tailwind-merge";

const page = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);

  const { playlistId } = useParams() as { playlistId: string };
  const { selectedPlaylist, getPlayListFromId } = useSpotifyContext();
  const [playlist, setSelectedPlaylist] = useState<any | null>(null);
  const panelRef = useRef(null);
  const [width, setWidth] = useState(0);
  const spotifyApi = useSpotify();
  useEffect(() => {
    console.log(session);
    console.log("spotigy", spotifyApi);
    console.log("SELECTED PLATLIST", playlist);
    console.log("token before", spotifyApi.getAccessToken());

    if (!spotifyApi.getAccessToken()) {
      console.log("pre");
      spotifyApi.setAccessToken(session?.user?.accessToken);
    } else {
      console.log("after");
      spotifyApi.getPlaylist(playlistId).then((data) => {
        console.log("finding playlist...", data.body.tracks.items.slice(0, 10));
        setLoading(false);
        setSelectedPlaylist(data.body.tracks.items.slice(0, 10));
      });
    }

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
  }, [selectedPlaylist, spotifyApi, session]);
  if (loading) return <div className="text-white">loading</div>;

  return (
    <div className="w-full text-neutral-300 text-[.75rem]">
      <div className="border-b border-neutral-600 flex justify-between my-1 pb-2">
        <div className="flex flex-1 gap-4 place-items-center">
          <span className="w-10 text-right">#</span>
          <span className={twJoin("w-96", width <= 500 && "w-fit")}>Title</span>
        </div>

        {width > 650 && <span className="flex-1 text-left w-36">Album</span>}
        {width > 850 && (
          <span className="flex-1 text-left w-36">Date added</span>
        )}
        <span
          className={twJoin(
            "text-right w-fit mr-6",
            width < 650 && "flex justify-end flex-1"
          )}
        >
          <ClockIcon className="size-6" />
        </span>
      </div>
      <div className="flex flex-col gap-4 text-white mt-6">
        {playlist?.map((song, idx) => (
          <Fragment key={song?.track?.id}>
            <Song order={idx} song={song} width={width} />
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default page;
