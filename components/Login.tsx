import Link from "next/link";
import React, { useEffect, useState } from "react";

const Login = () => {
  var client_id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  var client_secret = "CLIENT_SECRET";
  const [profile, setProfile] = useState(null);
  const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state`;

  //   useEffect(() => {
  //     fetch("/api/spotify")
  //       .then((res) => res.json())
  //       .then((data) => setProfile(data))
  //       .catch((err) => console.error(err));
  //   }, []);
  return (
    <div>
      <Link href={AUTH_URL}>Login</Link>
    </div>
  );
};

export default Login;
