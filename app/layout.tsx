import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../components/AuthProvider";
import SpotifyContext from "@/components/SpotifyContext";
import Player from "@/components/spotify/Player";
import { PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Main } from "next/document";
import TopBar from "@/components/spotify/TopBar";
import Sidebar from "@/components/Sidebar";
import Container from "@/components/Container";
import { usePathname } from "next/navigation";

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
        <body className="bg-neutral-900 flex place-items-center m-auto container h-screen p-4 border ">
          <SpotifyContext>
            <Container children={children} />
          </SpotifyContext>
        </body>
      </html>
    </AuthProvider>
  );
}
