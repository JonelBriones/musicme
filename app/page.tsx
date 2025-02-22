"use client";
import SpotifyPlayer from "@/components/SpotifyPlayer";
import { useSession } from "next-auth/react";
import Navbar from "../components/Navbar";

export default function Home() {
  const { data: session } = useSession();
  console.log(session);

  return (
    <div>
      <Navbar />
      <h1>
        Welcome {session?.user?.name ? session.user.name : "not logged in"}{" "}
      </h1>
      {/* <SpotifyPlayer /> */}
    </div>
  );
}
