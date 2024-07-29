import * as React from "react";
import { MdOutlineSearch } from "react-icons/md";
import { HomeIcon, Whislist } from "@public/svg/assets";
import Link from "next/link";
import { IoNotificationsOutline } from "react-icons/io5";
import { LuUser } from "react-icons/lu";
import { useSession } from "next-auth/react";

import { useMessage } from "@/lib/swr/message";

interface SideBarType {
  seeSearch: boolean;
  setSeeSearch: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MobileBar({ seeSearch, setSeeSearch }: SideBarType) {
  const { data: session }: any = useSession();
  const { msgNotifData } = useMessage.msgNotif(session?.user?._id);
  return (
    <div className="z-50 w-full h-12 bg-white border-t fixed bottom-0 left-0 md:hidden flex justify-center">
      <div className="w-full flex items-center justify-around">
        <Link href={"/"}>
          <HomeIcon color="#000" size={25} />
        </Link>
        <Link href={"/profil/whislist"}>
          <Whislist color="#000" size={25} />
        </Link>
        <div>
          <button
            className={`flex gap-2 items-center text-lg font-medium px-3 py-1`}
            id="button-search"
            onClick={() => setSeeSearch(seeSearch ? false : true)}
          >
            <MdOutlineSearch size={25} />
          </button>
        </div>
        <Link className="relative" href={"/profil/notifikasi"}>
          <span
            className={`size-2 bg-red-500 absolute rounded-full top-[5%] right-[19%] ${
              msgNotifData?.length > 0 ? "flex" : "hidden"
            } `}
          />
          <IoNotificationsOutline size={25} />
        </Link>
        <Link href={"/profil"}>
          <LuUser size={25} />
        </Link>
      </div>
    </div>
  );
}
