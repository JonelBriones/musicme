import { useData } from "@/components/hooks/useData";
import React from "react";

const page = () => {
  const songExample = useData();
  console.log(songExample);
  return <div>MUSIC RECOMMENDER</div>;
};

export default page;
