"use client";
import spotifyApi from "@/lib/spotify";
import React, { useEffect, useState } from "react";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchSongInfo = async () => {
      const categories = await fetch(
        `https://api.spotify.com/v1/browse/categories`,
        {
          headers: {
            Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
          },
        }
      ).then((res) => res.json());
      setCategories(categories.items);
    };
    fetchSongInfo();
  }, []);
  return (
    <div className="flex flex-col text-[1rem] h-screen p-4 text-white backgroundContainer">
      Categories
    </div>
  );
};

export default Categories;
