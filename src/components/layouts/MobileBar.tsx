import * as React from "react";
import { MdOutlineSearch } from "react-icons/md";
import { HomeIcon, Whislist } from "@public/svg/assets";
import Link from "next/link";
import { IoNotificationsOutline } from "react-icons/io5";
import { LuUser } from "react-icons/lu";

import { useContext } from "react";
import { GlobalState } from "@/lib/context/globalstate";

interface SideBarType {
  seeSearch: boolean;
  setSeeSearch: React.Dispatch<React.SetStateAction<boolean>>;
  mobileRef: React.LegacyRef<HTMLDivElement> | null;
}

export default function MobileBar({ seeSearch, setSeeSearch, mobileRef }: SideBarType) {
  const { notifUser, isDarkMode } = useContext(GlobalState);
  return (
    <div
      ref={mobileRef}
      className="z-50 w-full h-12 bg-white dark:bg-primary-black border-t fixed bottom-0 left-0 md:hidden flex justify-center"
    >
      <div className="w-full flex items-center justify-around">
        <Link aria-label="homeLink" href={"/"}>
          <HomeIcon color={`${isDarkMode ? "#FFFFFF" : "#000"}`} size={25} />
        </Link>
        <Link aria-label="whislistLink" href={"/profil/whislist"}>
          <Whislist color={`${isDarkMode ? "#FFFFFF" : "#000"}`} size={25} />
        </Link>
        <div>
          <button
            aria-label="buttonSearch"
            className={`flex gap-2 items-center text-lg font-medium px-3 py-1`}
            id="button-search"
            onClick={() => setSeeSearch(seeSearch ? false : true)}
          >
            <MdOutlineSearch size={25} />
          </button>
        </div>
        <Link aria-label="NotifLink" className="relative" href={"/profil/notifikasi"}>
          <span
            className={`size-2 bg-red-500 absolute rounded-full top-[5%] right-[19%] ${
              notifUser?.length > 0 ? "flex" : "hidden"
            } `}
          />
          <IoNotificationsOutline size={25} />
        </Link>
        <Link aria-label="profilLink" href={"/profil"}>
          <LuUser size={25} />
        </Link>
      </div>
    </div>
  );
}
