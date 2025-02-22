"use client";
import { getProviders, signIn, useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Login = () => {
  const [providers, setProviders] = useState(null);
  const { data: session } = useSession();
  useEffect(() => {
    const setAuthProviders = async () => {
      const res = await getProviders();
      setProviders(res);
      console.log(res);
    };
    setAuthProviders();
  }, []);
  console.log("session", session);
  return (
    <div>
      <h1>LOGIN HERE</h1>
      {providers &&
        Object.values(providers).map((provider) => (
          <button
            key={provider.name}
            onClick={() =>
              signIn(provider.id, {
                callbackUrl: "/",
              })
            }
          >
            Login {provider.name}
          </button>
        ))}
    </div>
  );
};

export default Login;
