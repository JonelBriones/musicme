import spotifyApi, { LOGIN_URL } from "../lib/spotify";
import SpotifyProvider from "next-auth/providers/spotify";
async function refreshAccessToken(token) {
  try {
    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.refreshAccessToken);

    const { body: refreshToken } = await spotifyApi.refreshAccessToken();

    console.log("refresh token:", refreshToken);

    return {
      ...token,
      accessToken: refreshToken.access_token,
      accessTokenExpires: Date.now + refreshToken.expires_at * 1000,
      refreshToken: refreshToken.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.log("auth Options", error);
    return {
      ...token,
      error: "Refresh access token error",
    };
  }
}

export const authOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorization: LOGIN_URL,
    }),
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      // initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires: account.expires_at * 1000,
        };
      }

      //    return previous token if has not expired
      if (Date.now() < token.accessTokenExpires) {
        console.log("returning prevous token");
        return token;
      }
      console.log("auth Options , callbacks", error);
      // refresh token once expired
      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      (session.user.accessToken = token.accessToken),
        (session.user.refreshToken = token.refreshToken),
        (session.user.user = token.username);

      return session;
    },
  },
};
