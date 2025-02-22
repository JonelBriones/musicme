"use client";
import { signOut, useSession } from "next-auth/react";
import React from "react";

const Navbar = () => {
  const { data: session } = useSession();
  return (
    <div>
      Navbar
      <button onClick={() => signOut()}>Log out</button>
    </div>
  );
};

export default Navbar;
