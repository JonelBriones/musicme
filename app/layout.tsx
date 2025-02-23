import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../components/AuthProvider";
import SpotifyContext from "@/components/SpotifyContext";

export const metadata: Metadata = {
  title: "MusicMe",
  description: "AI Music Recommendation Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className="bg-neutral-900">
          <SpotifyContext>{children}</SpotifyContext>
        </body>
      </html>
    </AuthProvider>
  );
}
