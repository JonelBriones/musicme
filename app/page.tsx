"use client";
import { useSession } from "next-auth/react";
import Categories from "@/components/spotify/Categories";
import EmbeddingPage from "@/components/EmbeddingPage";
import { useEffect, useState } from "react";
import { useSpotifyContext } from "@/components/SpotifyContext";
import Image from "next/image";
import { twJoin } from "tailwind-merge";
import { MusicalNoteIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function Home() {
  /* 
  
  recent tracks, genre, artist, 
  
  
  */

  const [data, setData] = useState(null);
  const { data: session, status } = useSession();
  const [songAndArtist, setSongAndArtist] = useState([]);
  const [artists, setArtists] = useState([]);
  const [trackMix, setTrackMix] = useState([]);
  const {
    handleMyRecentlyPlayedTracks,
    recentlyPlayedTracks,
    getCategories,
    categories,
    songInfo,
    spotifyApi,
  } = useSpotifyContext();

  // - Artists: ${artists?.map((artist) => artist).join("; ")}
  const prompt = `
      These are my recent played tracks

      - Artists: ${songAndArtist
        ?.map((track) => `${track.song} by ${track.artist}`)
        .join(", ")}

      Based on this, recommend 5 new artists that have similar characteristics
      Format the response as a JSON array of the artists.
      `;

  useEffect(() => {
    console.log(spotifyApi.getAccessToken());
    if (spotifyApi.getAccessToken() && recentlyPlayedTracks.length == 0) {
      console.log("calling recents");
      handleMyRecentlyPlayedTracks();
    }
    // getCategories();
  }, [session]);

  const handleGetArtist = async () => {
    let list = [];
    recentlyPlayedTracks.map(({ track }) => {
      const trackObject = {
        artist: track.artists[0].name,
        song: track.name,
      };
      // might contain duplicates
      // setArtists([...artists, track.artists[0].name]);
      console.log("current list", list);
      console.log("adding to song and artist", trackObject);

      list.push(trackObject);
      // spotifyApi.getArtistTopTracks(track.artists[0].id).then((data) => {
      //   let track1 = data.body.tracks[generateRandomNumber()[0]];
      //   let track2 = data.body.tracks[generateRandomNumber()[1]];
      //   setTrackMix([...trackMix, track1, track2]);
      // });
    });
    console.log("final list", list);
    setSongAndArtist(list);
  };
  const generateRandomNumber = () => {
    let num1 = Math.floor(Math.random() * 10);
    let num2 = Math.floor(Math.random() * 10);

    if (num1 == num2) {
      generateRandomNumber();
    }
    return [num1, num2];
  };
  useEffect(() => {
    // from recent tracks, extra artist name,
    if (recentlyPlayedTracks.length && songAndArtist.length == 0) {
      handleGetArtist();
    }
    if (songAndArtist.length > 0) {
      console.log("log prompt");
      const fetchData = async () => {
        const res = await fetch("/api/recommend", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        });

        const data = await res.json();
        console.log("data", data.recommendation);
        console.log("parsed", JSON.parse(data.recommendation));
        console.log("type", typeof data.recommendation);
        setData(JSON.parse(data.recommendation));
      };

      fetchData();
    }
  }, [recentlyPlayedTracks, songAndArtist]);

  useEffect(() => {
    if (data?.length > 0) {
      const query = data.join(",");
      console.log(query);
      spotifyApi.searchArtists(query).then((data) => {
        // body.artists.items.map((rec) => {
        //   // setRecommendedArtists(id)
        //   console.log(rec);
        // });
        console.log(data.body.artists.items);
        localStorage.setItem("recommended_artists");
        setArtists(data.body.artists.items);
      });
    }
  }, [data]);
  console.log(artists);

  const handleViewArtist = async (id) => {
    spotifyApi.getArtistTopTracks(id);
  };

  return (
    <div className="flex flex-col text-[1rem] h-screen p-4 text-white backgroundContainer overflow-auto">
      <div>
        <h1 className="text-[2rem]">Recommend Artists</h1>

        <div className="flex flex-wrap gap-4">
          {artists.map((artist) => {
            return (
              <Link
                key={artist?.id}
                className="flex flex-col gap-3 cursor-pointer overflow-hidden"
                href={`/artist/${artist?.id}`}
                // onClick={() => getPlayListFromId(id, playList)}
              >
                {artist?.images.length !== 0 ? (
                  <Image
                    height={120}
                    width={120}
                    alt={artist.name + "_img"}
                    src={artist?.images?.[0]?.url}
                    className="rounded-md"
                  />
                ) : (
                  // if no image is available
                  <div
                    className={twJoin(
                      `text-neutral-400 bg-neutral-800  rounded-md flex justify-center place-items-center w-[120px] h-[120px]`
                    )}
                  >
                    <MusicalNoteIcon className="text-neutral-400 size-7" />
                  </div>
                )}
                {/*  use observer */}
                {/* compact and list view */}
                <div className="flex justify-between overflow-hidden">
                  {artist.name}
                </div>
              </Link>
            );
          })}

          {trackMix.map((playList, idx) => {
            return (
              <div
                key={playList.id}
                className="flex gap-3 place-items-center cursor-pointer shrink-0 overflow-hidden"
                // href={`/playlist/${id}`}
                // onClick={() => getPlayListFromId(id, playList)}
              >
                {playList.album?.images.length !== 0 ? (
                  <Image
                    height={120}
                    width={120}
                    alt={playList.name + "_img"}
                    src={playList.album?.images?.[0]?.url}
                    className="rounded-md"
                  />
                ) : (
                  // if no image is available
                  <div
                    className={twJoin(
                      `text-neutral-400 bg-neutral-800  rounded-md flex justify-center place-items-center w-[120px] h-[120px]`
                    )}
                  >
                    <MusicalNoteIcon className="text-neutral-400 size-7" />
                  </div>
                )}
                {/*  use observer */}
                {/* compact and list view */}
                <div className="flex justify-between overflow-hidden">
                  <p className="text-white text-[1rem] w-full truncate">
                    {playList.name}
                  </p>

                  {/* <p className="text-white text-[1rem] truncate">
                          {name} date_added
                        </p>
                        <p className="text-white text-[1rem] truncate">
                          {name} recently played
                        </p> */}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
