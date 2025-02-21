"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

import Login from "@/components/Login";
import {
  redirectToAuthCodeFlow,
  getAccessToken,
  fetchProfile,
  populateUI,
} from "./lib/spotifyAuth";
import Link from "next/link";

export default function Home() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  var client_id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  // const urlParams = new URLSearchParams(window.location.search);
  // const code = urlParams.get("code");
  useEffect(() => {
    async function fetchData() {
      if (typeof window !== "undefined") {
        const code = new URLSearchParams(window.location.search).get("code");

        if (!code) {
          redirectToAuthCodeFlow(client_id);
        }

        try {
          const accessToken = await getAccessToken(client_id, code);

          if (!accessToken) {
            console.error("Failed to obtain access token");
            setLoading(false);
            return;
          }
          const profileData = await fetchProfile(accessToken);
          setProfile(profileData);
        } catch (error) {
          console.error("Error fetching Spotify data:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchData();
  }, []);
  if (!profile) return <p>Loading...</p>;
  const { display_name, email } = profile;
  return (
    <div>
      <span>spotify name: {display_name}</span>
      <Login />
    </div>
  );
}
