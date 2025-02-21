import { NextResponse } from "next/server";
import {
  getAccessToken,
  fetchProfile,
  populateUI,
} from "@/app/lib/spotifyAuth";

export async function GET(req: Request) {
  console.log("running spotify api route");
  const client_id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  console.log("I GOT THIS CODE", code);
  if (!code) {
    return NextResponse.json(
      { error: "No authorization code provided" },
      { status: 400 }
    );
  }

  //   try {
  //     const accessToken = await getAccessToken(client_id, code);
  //     if (!accessToken) throw new Error("Failed to get access token");

  //     const profile = await fetchProfile(accessToken);
  //     return NextResponse.json(profile);
  //   } catch (error) {
  //     return NextResponse.json({ error: error.message }, { status: 500 });
  //   }

  try {
    const accessToken = await getAccessToken(client_id!, code);
    if (accessToken) {
      return NextResponse.json(
        {
          error: "Failed to obtain access token",
        },
        { status: 500 }
      );
    }
    const profile = await fetchProfile(accessToken);
    return NextResponse.json({ profile }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error " },
      { status: 500 }
    );
  }
}
