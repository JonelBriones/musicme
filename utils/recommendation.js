import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });
const userSongs = [
  {
    title: "Blinding Lights",
    artist: "The Weeknd",
    genres: ["pop", "synthwave"],
    danceability: 0.75,
    energy: 0.8,
    mood: "upbeat",
  },
  {
    title: "Someone Like You",
    artist: "Adele",
    genres: ["soul", "pop"],
    danceability: 0.4,
    energy: 0.3,
    mood: "melancholic",
  },
];

const prompt = `
  I like songs with the following characteristics:
  - Genres: ${userSongs.map((song) => song.genres.join(", ")).join("; ")}
  - Danceability: ${userSongs.map((song) => song.danceability).join(", ")}
  - Energy: ${userSongs.map((song) => song.energy).join(", ")}
  - Mood: ${userSongs.map((song) => song.mood).join(", ")}
  
  Based on this, recommend 5 new songs with similar characteristics.
  Format the response as a JSON array with { title, artist, genres, reason_for_recommendation }.
  `;

export const createPromt = async () => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "You are a music recommendation assistant." },
      { role: "user", content: prompt },
    ],
    temperature: 0.8,
  });
  return response.choices[0].message.content;
};
