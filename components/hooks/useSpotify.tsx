import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import spotifyApi from "@/lib/spotify";
const useSpotify = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session) {
      if (session.error == "RefreshAccessTokenError") {
        signIn();
      }
      console.log("spotify hook", spotifyApi);
      spotifyApi.setAccessToken(session.user.accessToken);
      localStorage.setItem("spotify_access_token", session.user.accessToken);
    }
  }, [session]);
  return spotifyApi;
};

export default useSpotify;
