"use client";
// import spotifyApi from "@/lib/spotify";
import { signIn, useSession } from "next-auth/react";
import { redirect, useParams } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import useSpotify from "./hooks/useSpotify";
const ThemeContext = createContext(null);

const SpotifyContext = ({ children }: { children: React.ReactNode }) => {
  const [selectedPlaylist, setSelectedPlaylist] = useState<any | null>(null);
  const [currentTrackId, setCurrentTrackId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(null);
  const [viewPlaylist, setViewPlaylist] = useState(false);
  const [currentTrack, setCurrentTrack] = useState({});
  const [recentlyPlayedTracks, setRecentlyPlayedTracks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [userPlaylist, setUserPlaylist] = useState([]);
  const [lyrics, setLyrics] = useState("");
  const [songData, setSongData] = useState({});
  const [songInfo, setSongInfo] = useState(null);
  const [MainContainerWidth, setMainContainerWidth] = useState(0);
  const [SideAndMainWidth, setSideAndMainWidth] = useState(0);
  const param = useParams();
  const { data: session, status } = useSession();

  // useEffect(()=>{
  //   console.log("use spotify");
  //   if (session) {
  //     if (session.error == "RefreshAccessTokenError") {
  //       signIn();
  //     }
  //     spotifyApi.setAccessToken(session.user.accessToken);
  //   }
  //   return spotifyApi;
  // },[session])
  const spotifyApi = useSpotify();

  // console.log(categories);

  const validateAccessToken = spotifyApi.getAccessToken();

  const getPlayListFromId = (id: string): any => {
    console.log(spotifyApi._crendtials);
    console.log(validateAccessToken);
    !validateAccessToken && validateAccessToken;
    spotifyApi.getPlaylist(id).then((data) => {
      console.log("finding playlist...", data);
      setSelectedPlaylist(data.body.tracks.items.slice(0, 10));
      setViewPlaylist(viewPlaylist);
    });
    // setSelectedPlaylist(data.body.tracks.items.slice(0, 10));
    // setViewPlaylist(viewPlaylist);
  };
  const getUserPlaylists = () => {
    console.log(spotifyApi);
    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .getUserPlaylists()
        .then((data) => {
          console.log("user playlist", data.body.items);
          setUserPlaylist(data.body.items);
        })
        .catch((err) => {
          console.log(err);
          redirect("/login");
        });
    }
  };

  const fetchSongInfo = async () => {
    if (currentTrackId) {
      const trackInfo = await fetch(
        `https://api.spotify.com/v1/tracks/${currentTrackId}`,
        {
          headers: {
            Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
          },
        }
      ).then((res) => res.json());
      setSongInfo(trackInfo);
    }
  };

  const geArtistInfo = async () => {
    const artistInfo = await fetch(
      `https://api.spotify.com/v1/artists/${selectedSong.artists[0].id}`,
      {
        headers: {
          Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
        },
      }
    ).then((res) => {
      res.json();
    });
    setSongData({
      ...songData,
      artist: artistInfo.name,
      genres: artistInfo.genres,
      lyrics,
    });
  };
  const getCategories = async () => {
    const categories = await fetch(
      `https://api.spotify.com/v1/browse/categories`,
      {
        headers: {
          Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
        },
      }
    ).then((res) => {
      res.json();
    });
    setCategories(categories);
  };

  const getLyrics = async () => {
    // `https://api.lyrics.ovh/v1/${selectedSong.artists[0].name}/${selectedSong.name}`
    const lyrics = await fetch(`https://api.lyrics.ovh/v1/newjeans/omg`).then(
      (res) => res.json()
    );
    console.log("getting lyrics...", lyrics);
    setLyrics(lyrics);
  };

  // useEffect(() => {
  //   getLyrics();

  // }, [currentTrackId, spotifyApi]);

  const getMyRecentlyPlayedTracks = async () => {
    spotifyApi.getMyRecentlyPlayedTracks().then((data) => {
      setRecentlyPlayedTracks(data.body?.items);
    });
  };

  return (
    <ThemeContext.Provider
      value={{
        selectedPlaylist,
        getPlayListFromId,
        setCurrentTrackId,
        currentTrackId,
        setIsPlaying,
        isPlaying,
        songInfo,
        SideAndMainWidth,
        setSideAndMainWidth,
        getUserPlaylists,
        userPlaylist,
        spotifyApi,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default SpotifyContext;

export function useSpotifyContext() {
  return useContext(ThemeContext);
}
