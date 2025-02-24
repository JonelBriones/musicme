import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [{}],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mosaic.scdn.co",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "i.scdn.co",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "api.lyrics.ovh/v1",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
