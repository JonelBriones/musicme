import React, { useEffect, useState } from "react";

const EmbeddingPage = () => {
  const userdata = [
    {
      title: "OMG",
      artist: "New Jeans",
      genres: ["kpop"],
    },
    {
      title: "What is Love?",
      artist: "TWICE",
      genres: ["kpop"],
    },
  ];
  // - Danceability: ${userdata.map((song) => song.danceability).join(", ")}
  // - Energy: ${userdata?.map((song) => song.energy).join(", ")}
  // - Mood: ${userdata?.map((song) => song.mood).join(", ")}
  const prompt = `
      I like songs with the following characteristics:
      - Genres: ${userdata?.map((song) => song.genres.join(", ")).join("; ")}
      Based on this, recommend 5 new songs with similar characteristics.
      Format the response as a JSON array with { title, artist, genres, reason_for_recommendation }.
      `;
  const [data, setData] = useState();
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      console.log(data);
      setData(data.recommendation);

      // const res = await fetch("https://api.openai.com/v1/embeddings", {
      //   method: "POST",
      //   // headers: {
      //   //   Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
      //   //   "Content-Type": "application/json",
      //   // },
      //   body: JSON.stringify({
      //     model: "text-embedding-3-small",
      //     input: "Hello world!",
      //     encoding_formate: "float",
      //   }),
      // })
      //   .then((res) => res.json())
      //   .catch((err) => console.log(err));

      // console.log(res);
    };

    fetchData();
  }, []);
  useEffect(() => {
    console.log(data);
  }, [data]);
  return <div></div>;
};

export default EmbeddingPage;
