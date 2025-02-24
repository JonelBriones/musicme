import { NextResponse } from "next/server";
import React from "react";

export async function getLyrics(name, artist) {
  try {
    const lyrics = await fetch(`https://api.lyrics.ovh/v1/${artist},${name}`);
    return NextResponse.json({
      lyrics: lyrics,
    });
  } catch (err) {
    NextResponse.json(
      {
        error: "Failed to fetch lyrics",
      },
      {
        status: 500,
      }
    );
  }
}
