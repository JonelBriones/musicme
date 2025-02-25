"use client";
import { getProviders, signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Login = () => {
  const [providers, setProviders] = useState(null);
  useEffect(() => {
    const setAuthProviders = async () => {
      const res = await getProviders();
      setProviders(res);
      console.log(res);
    };
    setAuthProviders();
  }, []);

  if (providers == null) return <div>loading...</div>;
  return (
    <div className="h-screen w-screen place-items-center flex flex-col justify-center">
      <div className="backgroundContainer h-[620px] w-[500px] flex  justify-between flex-col place-items-center ">
        <div className="mt-20">
          <Image
            src={
              "/images/2024 Spotify Brand Assets/Spotify_Full_Logo_RGB_White.png"
            }
            alt="Spotify_Full_Logo_RGB_White.png"
            width={180}
            height={180}
          />
        </div>

        <div className="flex flex-1 place-items-center w-full">
          {providers &&
            Object.values(providers).map((provider) => (
              <button
                key={provider.name}
                onClick={() =>
                  signIn(provider.id, {
                    callbackUrl: "/",
                  })
                }
                className="text-white bg-[#1ed966] rounded-full p-4 w-full text-[1.2em]"
              >
                LOG IN TO {provider.name.toUpperCase()}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Login;
