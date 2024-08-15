"use client";
import * as React from "react";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";

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
import MisiContextProvider from "@/lib/context/misicontext";
import { SessionProvider } from "next-auth/react";

export default function Global({ children }: { children: React.ReactNode }) {
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
    <SessionProvider>
      <GlobalStateProvider>
        <AuthCntextProvider>
          <UserContextProvider>
            <BookContextProvider>
              <WhislistContextProvider>
                <StoryContextProvider>
                  <LikeContextProvider>
                    <MisiContextProvider>
                      <Index>
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
                      </Index>
                    </MisiContextProvider>
                  </LikeContextProvider>
                </StoryContextProvider>
              </WhislistContextProvider>
            </BookContextProvider>
          </UserContextProvider>
        </AuthCntextProvider>
      </GlobalStateProvider>
    </SessionProvider>
  );
}
