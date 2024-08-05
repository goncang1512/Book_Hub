"use client";
import * as React from "react";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";

import Global from "./global";

import Index from ".";

import SideBar from "@/components/layouts/sidebar";
import GlobalStateProvider from "@/lib/context/globalstate";
import SearchContainer from "@/components/layouts/searchcontainer";
import AuthCntextProvider from "@/lib/context/authcontext";
import UserContextProvider from "@/lib/context/usercontext";
import MobileBar from "@/components/layouts/MobileBar";
import BookContextProvider from "@/lib/context/bookcontext";
import StoryContextProvider from "@/lib/context/storycontext";
import LikeContextProvider from "@/lib/context/likecontext";
import WhislistContextProvider from "@/lib/context/whislistcontext";
import Mission from "@/components/layouts/mission";
import useClickOutside from "@/lib/utils/clickoutside";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [seeSearch, setSeeSearch] = useState<boolean>(false);
  const [seeMission, setSeeMission] = useState<boolean>(false);

  const searchButton = useRef<HTMLButtonElement | null>(null);
  const containerSearch = useRef<HTMLDivElement | null>(null);

  useClickOutside([searchButton, containerSearch], () => setSeeSearch(false));

  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const missionRef = useRef<HTMLDivElement | null>(null);
  const buttonMission = useRef<HTMLButtonElement | null>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  useClickOutside([sidebarRef, missionRef, buttonMission, mobileRef], () => setSeeMission(false));

  const disableSideBar = ["/login", "/register"];
  const disableMl60 = ["/login", "/register"];
  const startsWithRequireAuth = disableSideBar.some((route) => pathname.startsWith(route));

  return (
    <html lang="en">
      <head>
        <title>BookHub</title>
      </head>
      <body className={`${inter.className} flex overflow-x-hidden`}>
        <SessionProvider>
          <Index>
            <GlobalStateProvider>
              <AuthCntextProvider>
                <UserContextProvider>
                  <BookContextProvider>
                    <WhislistContextProvider>
                      <StoryContextProvider>
                        <LikeContextProvider>
                          <Global>
                            {!startsWithRequireAuth && (
                              <nav className="flex relative">
                                <SideBar
                                  searchButtonRef={searchButton}
                                  seeMission={seeMission}
                                  seeSearch={seeSearch}
                                  setSeeMission={setSeeMission}
                                  setSeeSearch={setSeeSearch}
                                  sidebarRef={sidebarRef}
                                />
                                <MobileBar
                                  mobileRef={mobileRef}
                                  seeSearch={seeSearch}
                                  setSeeSearch={setSeeSearch}
                                />
                                <SearchContainer
                                  containerSearchRef={containerSearch}
                                  seeSearch={seeSearch}
                                  setSeeSearch={setSeeSearch}
                                />
                                <Mission
                                  buttonMission={buttonMission}
                                  missionRef={missionRef}
                                  seeMission={seeMission}
                                  setSeeMission={setSeeMission}
                                />
                              </nav>
                            )}
                            <main
                              className={`w-full max-[768px]:pb-14  ${
                                !disableMl60.includes(pathname) && "md:ml-72 ml-0"
                              }`}
                            >
                              {children}
                            </main>
                          </Global>
                        </LikeContextProvider>
                      </StoryContextProvider>
                    </WhislistContextProvider>
                  </BookContextProvider>
                </UserContextProvider>
              </AuthCntextProvider>
            </GlobalStateProvider>
          </Index>
        </SessionProvider>
      </body>
    </html>
  );
}
