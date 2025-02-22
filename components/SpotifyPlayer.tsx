"use client";
import { PartialUser } from "@/_types";
import {
  fetchProfile,
  fetchTracks,
  getAccessToken,
  getRefreshToken,
  redirectToAuthCodeFlow,
} from "@/lib/spotifyAuth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const SpotifyPlayer = () => {
  const { data: session } = useSession();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<PartialUser | null>(null);
  var client_id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!;
  var redirect_uri = process.env.SPOTIFY_REDIRECT_URI!;
  const router = useRouter();
  useEffect(() => {
    console.log("SPOTIFYPLAY.TSX");
    const code = new URLSearchParams(window.location.search).get("code")!;
    console.log(code);
    async function getToken() {
      // const token = await getAccessToken(client_id, code);
      const localToken = localStorage.getItem("spotify_access_token");
      console.log("localToken", localToken);
      if (localToken) {
        setAccessToken(localToken);
        const profile = await fetchProfile(localToken);
        console.log(profile);
        setProfile(profile);
      } else {
        const token = await getAccessToken(client_id, code);
        console.log("token", token);
        if (token) {
          localStorage.setItem("spotify_access_token", token);
          setAccessToken(token);
          const profile = await fetchProfile(token);
          setProfile(profile);
          const newUrl = window.location.pathname;
          router.replace(newUrl, undefined, { shallow: true });
          console.log(profile);
        }
      }
    }
    getToken();
    console.log(profile);
  }, []);

  useEffect(() => {
    if (accessToken) {
      console.log("access token", accessToken);
      async function fetchPlayBack() {
        const tracks = await fetchTracks(accessToken!);
        console.log(tracks);
      }
      fetchPlayBack();
    }
  }, [accessToken]);

  return (
    <div>
      {profile !== null ? (
        <div>
          <p>USER:{profile.display_name}</p>
          <span>ACCESSTOKEN AVAILABLE:{accessToken ? "true" : "false"}</span>
        </div>
      ) : (
        <button onClick={() => redirectToAuthCodeFlow(client_id)}>
          Login with spotify
        </button>
      )}
    </div>
  );
};

export default SpotifyPlayer;
