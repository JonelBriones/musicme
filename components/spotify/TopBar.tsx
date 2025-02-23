import { signOut, useSession } from "next-auth/react";
import React from "react";

const TopBar = () => {
  const { data: session } = useSession();

  return (
    <div>
      <h1>
        Welcome {session?.user?.name ? session.user.name : "not logged in"}{" "}
        <button onClick={() => signOut()}>Log out</button>
      </h1>
    </div>
  );
};

export default TopBar;
