"use client";
import spotifyApi from "@/lib/spotify";
import { useSession } from "next-auth/react";
import React, {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import useSpotify from "./hooks/useSpotify";
import { useSpotifyContext } from "./SpotifyContext";
import Image from "next/image";
import { twJoin } from "tailwind-merge";
import {
  MagnifyingGlassIcon,
  MusicalNoteIcon,
  Squares2X2Icon,
  ListBulletIcon,
  CheckIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import { Panel } from "react-resizable-panels";
import { useMediaQuery } from "usehooks-ts";
import Link from "next/link";

const Sidebar = () => {
  const { data: session } = useSession();
  const { getUserPlaylists, userPlaylist } = useSpotifyContext();
  const spotifyApi = useSpotify();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userPlaylist.length == 0) {
      getUserPlaylists();
      setLoading(false);
    }
    // if (spotifyApi.getAccessToken()) {
    //   console.log("access token", spotifyApi._credentials);
    //   spotifyApi
    //     .getUserPlaylists()
    //     .then((data) => {
    //       setPlaylists(data.body.items);
    //       console.log("PLAYLIST", data.body.items);
    //       setLoading(false);
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //       redirect("/login");
    //     });
    // }
  }, [session, spotifyApi]);

  const [viewAs, setViewAs] = useState("list");
  const [squareMaxSize, setSquareRange] = useState(64);

  const [toggleLayout, setToggleLayout] = useState(false);
  const toggleLayoutRef = useRef(null);
  const toggleButtonRef = useRef(null);
  const toggleSearchRef = useRef(null);
  const toggleSearchButtonRef = useRef(null);

  const handleCloseToggleLayout = useCallback((e) => {
    if (
      toggleLayoutRef.current &&
      !toggleLayoutRef.current.contains(e.target) && // Click outside div
      toggleButtonRef.current &&
      !toggleButtonRef.current.contains(e.target) // Click outside button
    ) {
      setToggleLayout(false);
    }
    if (
      toggleSearchRef.current &&
      !toggleSearchRef.current.contains(e.target) && // Click outside div
      toggleSearchButtonRef.current &&
      !toggleSearchButtonRef.current.contains(e.target) // Click outside button
    ) {
      setToggleSearch(false);
    }
  });

  useEffect(() => {
    document.body.addEventListener("mousedown", handleCloseToggleLayout);
    return () => {
      document.body.removeEventListener("mousedown", handleCloseToggleLayout);
    };
  }, [handleCloseToggleLayout]);

  const [toggleSearch, setToggleSearch] = useState(false);

  const isMobile = useMediaQuery("(max-width: 767px");
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px");
  const isDesktop = useMediaQuery("(min-width: 1024px");

  const mobileSize = () => {
    if (isMobile) return 20;
    if (isTablet) return 10;
    if (isDesktop) return 5;
  };
  const panelRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!panelRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      setWidth(width);
      if (width < 270) {
        setToggleSearch(false);
        setViewAs("grid");
      }
    });

    observer.observe(panelRef.current);

    return () => {
      if (panelRef.current) {
        observer.unobserve(panelRef.current);
      }
    };
  }, []);

  const onExpandLibrary = () => {
    return true;
  };
  console.log(width);
  // console.log(userPlaylist);
  return (
    <Panel
      id="sidebar"
      minSize={mobileSize()}
      order={1}
      collapsedSize={10}
      onCollapse={onExpandLibrary}
      className="flex flex-col overflow-auto backgroundContainer relative shrink-0"
    >
      <div
        ref={panelRef}
        className="flex justify-between  text-neutral-400 mx-2 py-2 "
      >
        {width > 240 && (
          <>
            <div
              ref={toggleSearchRef}
              className="flex place-items-center w-4/5 relative"
            >
              <div
                className={`absolute top-0 left-0 bottom-0 rounded-lg w-0 bg-neutral-600 sidebarSearch ${
                  toggleSearch ? "w-full" : ""
                }`}
              />
              <MagnifyingGlassIcon
                ref={toggleSearchButtonRef}
                className={`size-8 text-neutral-400 p-1 bg-transparent pl-2 z-10 rounded-full ${
                  toggleSearch
                    ? "z-1 cursor-text"
                    : "hover:bg-neutral-600 cursor-pointer"
                }`}
                onClick={() => {
                  !toggleSearch && setToggleSearch(!toggleSearch);
                }}
              />
              <input
                type="text"
                placeholder="Search your library"
                className={`${
                  toggleSearch
                    ? "absolute top-0 left-7"
                    : "cursor-default opacity-0 w-0"
                } p-1 rounded-r-lg bg-transparent text-neutral-400 outline-none opacity-100`}
              />
            </div>

            <div className="flex place-items-center relative">
              <div
                ref={toggleButtonRef}
                className="hover:text-neutral-200 hover:text-[1.05rem] flex gap-2 z-10"
                onClick={() => {
                  setToggleLayout(!toggleLayout);
                }}
              >
                <span className={`font-light ${toggleSearch ? "hidden" : ""}`}>
                  Recents
                </span>
                {viewAs == "grid" ? (
                  <Squares2X2Icon className=" size-6" />
                ) : viewAs == "list" ? (
                  <ListBulletIcon className=" size-6" />
                ) : (
                  <Bars3Icon className=" size-6" />
                )}
              </div>

              {toggleLayout && (
                <div
                  ref={toggleLayoutRef}
                  className={twJoin(
                    "absolute -bottom-40 w-44 flex flex-col right-0 bg-[#3d3d3d] p-1 rounded-lg z-10",
                    viewAs == "grid" && "rounded-b-none"
                  )}
                >
                  <span
                    className="flex gap-3 justify-between hover:bg-neutral-600 bg-[#3d3d3d] p-3"
                    onClick={() => setViewAs("compact")}
                  >
                    <div
                      className={twJoin(
                        viewAs == "compact" && "text-[#1ed760]",
                        "flex gap-3"
                      )}
                    >
                      <Bars3Icon className=" size-6" />
                      <span>Compact</span>
                    </div>
                    {viewAs == "compact" && (
                      <CheckIcon className="size-6 text-[#1ed760]" />
                    )}
                  </span>
                  <span
                    className="flex gap-3 justify-between hover:bg-neutral-600 bg-[#3d3d3d] p-3"
                    onClick={() => setViewAs("list")}
                  >
                    <div
                      className={twJoin(
                        viewAs == "list" && "text-[#1ed760]",
                        "flex gap-3"
                      )}
                    >
                      <ListBulletIcon className=" size-6" />
                      <span>List</span>
                    </div>
                    {viewAs == "list" && (
                      <CheckIcon className="size-6 text-[#1ed760]" />
                    )}
                  </span>
                  <span
                    className="flex gap-3 justify-between hover:bg-neutral-600 bg-[#3d3d3d] p-3"
                    onClick={() => setViewAs("grid")}
                  >
                    <div
                      className={twJoin(
                        viewAs == "grid" && "text-[#1ed760]",
                        "flex gap-3"
                      )}
                    >
                      <Squares2X2Icon className=" size-6" />
                      <span>Grid</span>
                    </div>
                    {viewAs == "grid" && (
                      <CheckIcon className="size-6 text-[#1ed760]" />
                    )}
                  </span>
                  {viewAs == "grid" && (
                    <span
                      className="flex gap-3 justify-between bg-[#3d3d3d] p-3 absolute -bottom-7 w-44 left-0 rounded-b-lg"
                      onClick={() => setViewAs("grid")}
                    >
                      <input
                        type="range"
                        value={squareMaxSize}
                        min={64}
                        max={300}
                        onChange={(e) => setSquareRange(Number(e.target.value))}
                      />
                    </span>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {loading ? (
        <div>loading...</div>
      ) : (
        <div
          className={twJoin(
            "grid gap-2 grid-cols-1",
            width < 180 && "grid-cols-1 ",
            width >= 180 && width < 320 && "grid-cols-2 ",
            width >= 320 && width < 420 && "grid-cols-3 ",
            width >= 420 && width < 520 && "grid-cols-4",
            width >= 520 && width < 620 && "grid-cols-5",
            width >= 620 && width < 720 && "grid-cols-6",
            width >= 720 && width < 820 && "grid-cols-7",
            width >= 820 && width < 920 && "grid-cols-8",
            width >= 920 && width < 1020 && "grid-cols-9"
          )}
        >
          {userPlaylist.map((playList, idx) => {
            const { images, id, name } = playList;
            return (
              <Link className="square" href={`/playlist/${id}`}>
                {viewAs !== "compact" &&
                  (images !== null ? (
                    <Image
                      layout="fill"
                      objectFit="cover"
                      alt={playList?.name + "_img"}
                      src={playList.images?.[0]?.url}
                      className="rounded-md content  "
                    />
                  ) : (
                    // if no image is available
                    <div className="text-neutral-400 bg-neutral-800 content flex place-items-center justify-center">
                      <MusicalNoteIcon className="text-neutral-400 w-3/6" />
                    </div>
                  ))}
                {/*  use observer */}
                {/* compact and list view */}
                {width > 240
                  ? viewAs !== "grid" && (
                      <div className="flex justify-between overflow-hidden">
                        <p className="text-white text-[1rem] w-full truncate">
                          {name}
                        </p>

                        {/* <p className="text-white text-[1rem] truncate">
                          {name} date_added
                        </p>
                        <p className="text-white text-[1rem] truncate">
                          {name} recently played
                        </p> */}
                      </div>
                    )
                  : ""}
              </Link>
            );
          })}
        </div>
      )}
    </Panel>
  );
};

export default Sidebar;
