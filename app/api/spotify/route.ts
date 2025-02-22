import { NextResponse } from "next/server";
import {
  generateCodeChallenge,
  generateCodeVerifier,
  getAccessToken,
} from "@/lib/spotifyAuth";
import { setCookie } from "cookies-next";
import { NextRequest } from "next/server";

// if(typeof window !== "undefined") {
//     urlParams = new URLSearchParams(window.location.search)
// }
// API LOGIN FOR AUTHENTICATION & TOKENS
export async function redirectToAuthCodeFlow(clientId: string) {
  // TODO: Redirect to Spotify authorization page
  const verifier = generateCodeVerifier(128);
  const challenge = await generateCodeChallenge(verifier);

  localStorage.setItem("verifier", verifier);

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("response_type", "code");
  params.append("redirect_uri", "http://localhost:3000");
  params.append(
    "scope",
    "user-read-private user-read-email streaming user-library-read user-library-modify user-read-playback-state user-modify-playback-state"
  );
  params.append("code_challenge_method", "S256");
  params.append("code_challenge", challenge);

  window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

// export async function GET(req: Request) {
//   console.log("API/SPOTIFY/ROUTE.JS");

//   var client_id = process.env.SPOTIFY_CLIENT_ID!;
//   var client_secret = process.env.SPOTIFY_CLIENT_SECRET!;
//   var redirect_uri = process.env.SPOTIFY_REDIRECT_URI!;

//   const { searchParams } = new URL(req.url);
//   console.log(req.url);

//   const code = searchParams.get("code");

//   console.log("search", searchParams);

//   if (!code) {
//     return NextResponse.json(
//       { error: "No authorization code provided" },
//       { status: 400 }
//     );
//   }

//   try {
//     const params = new URLSearchParams();
//     params.append("client_id", client_id);
//     params.append("client_secret", client_secret);
//     params.append("grant_type", "authorization_code");
//     params.append("code", code);
//     params.append("redirect_uri", redirect_uri);

//     const response = await fetch("https://accounts.spotify.com/api/token", {
//       method: "POST",
//       headers: { "Content-Type": "application/x-www-form-urlencoded" },
//       body: params,
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       return NextResponse.json({ error: data.error }, { status: 400 });
//     }

//     return NextResponse.json(data);
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to fetch token" },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(req: Request) {
//   const { access_token, expires_in } = await req.json();

//   const response = NextResponse.json({ success: true });

//   setCookie("spotify_token", access_token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     maxAge: expires_in,
//     path: "/",
//   });

//   return response;
// }
