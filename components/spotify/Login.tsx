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
      <div className="backgroundContainer h-[620px] w-[600px] flex flex-col place-items-center">
        <div className="flex-col flex-1 flex place-items-center w-full">
          <div className="flex-col place-items-center ">
            <Image
              src={
                "/images/2024 Spotify Brand Assets/Spotify_Primary_Logo_RGB_White.png"
              }
              alt="Spotify_Full_Logo_RGB_White.png"
              width={40}
              height={40}
            />
            <h1 className="text-white text-[1.875rem] font-bold">
              Log in to Spotify
            </h1>
          </div>
          <div className="flex flex-col gap-2 place-items-center mt-4">
            {/* {providers &&
            Object.values(providers).map(
              (provider) =>
                provider.name !== "Spotify" && (
                  <button
                    key={provider.name}
                    onClick={() =>
                      signIn(provider.id, {
                        callbackUrl: "/",
                      })
                    }
                    className="text-white bg-[#1ed966] rounded-full p-2 w-full"
                  >
                    LOG IN TO {provider.name.toUpperCase()}
                  </button>
                )
            )} */}

            {Array(3)
              .fill(null)
              .map((_, idx) => (
                <button
                  key={idx}
                  className="text-white font-semibold bg-transparent rounded-full p-2 w-[330px] border border-neutral-700 hover:border-white mb-[.5rem]"
                >
                  Log in
                </button>
              ))}
          </div>
        </div>

        <div className="border-b w-full  border-neutral-700" />

        <div className="flex place-items-center w-full flex-1">
          <div className="flex place-items-center justify-center flex-1">
            {providers &&
              Object.values(providers).map(
                (provider) =>
                  provider.name == "Spotify" && (
                    <button
                      key={provider.name}
                      onClick={() =>
                        signIn(provider.id, {
                          callbackUrl: "/",
                        })
                      }
                      className="text-black font-semibold bg-[#1ed760] rounded-full p-2 w-[330px] hover:w-[340px] hover:py-[.575rem] hover:bg-[#1ef984]"
                    >
                      Log In
                    </button>
                  )
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
