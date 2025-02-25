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
  return <div className="text-white">Categories</div>;
};

export default Categories;
