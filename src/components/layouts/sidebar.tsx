import * as React from "react";
import { MdOutlineBorderColor, MdOutlineSearch, MdOutlineLeaderboard } from "react-icons/md";
import { HomeIcon, Whislist, DasboardIcon } from "@public/svg/assets";
import Link from "next/link";
import { HiOutlineInbox } from "react-icons/hi";
import { BiStore } from "react-icons/bi";
import { IoNotificationsOutline } from "react-icons/io5";
import { LuMenu, LuUser } from "react-icons/lu";
import { TbLogout } from "react-icons/tb";
import { usePathname } from "next/navigation";
import { FaArrowRightLong, FaRegAddressBook } from "react-icons/fa6";
import { signIn, useSession, signOut } from "next-auth/react";
import { LegacyRef, useEffect, useState } from "react";
import { HiMiniBars3BottomRight } from "react-icons/hi2";
import { FaRegBookmark } from "react-icons/fa";
import { GiBookmarklet } from "react-icons/gi";
import { IoIosArrowDown } from "react-icons/io";
import { SiBookmyshow } from "react-icons/si";

import { useMessage } from "@/lib/swr/message";

interface SideBarType {
  seeSearch: boolean;
  setSeeSearch: React.Dispatch<React.SetStateAction<boolean>>;
  searchButtonRef: LegacyRef<HTMLButtonElement> | null;
  seeMission: boolean;
  setSeeMission: React.Dispatch<React.SetStateAction<boolean>>;
  sidebarRef: React.LegacyRef<HTMLDivElement> | null;
}

export default function SideBar({
  seeSearch,
  setSeeSearch,
  searchButtonRef,
  seeMission,
  setSeeMission,
  sidebarRef,
}: SideBarType) {
  const pathname = usePathname();
  const { data: session, status }: { data: any; status: string } = useSession();
  const { msgNotifData } = useMessage.msgNotif(session?.user?._id);
  const [seeDasboard, setSeeDasboard] = useState(false);

  return (
    <div ref={sidebarRef} className="flex z-50">
      <div
        className={`bg-white fixed md:flex hidden left-0 right-0 w-72 h-screen  border-r shadow-lg  flex-col gap-[30px] py-5`}
      >
        <h1 className="flex items-center font-bold pl-8 gap-2">
          <GiBookmarklet className="text-[#00b88c]" size={40} />
          BookHub
        </h1>
        {/* Remake Main */}
        <div className="flex flex-col pt-[20px]">
          <h4 className="text-sm text-gray-400 pl-8 flex items-center gap-2">
            <FaRegBookmark size={15} /> Main
          </h4>
          <div className="flex flex-col gap-2">
            <Link
              className={`${
                pathname === "/" && "bg-[#00b88c] text-white"
              } flex gap-2 items-center text-lg font-medium px-8 py-1`}
              href={"/"}
            >
              <HomeIcon color={`${pathname === "/" ? "#FFFFFF" : "#000"}`} size={16} /> Home
            </Link>

            <Link
              className={`${
                pathname === "/orders" && "bg-[#00b88c] text-white"
              } gap-2 items-center text-lg font-medium px-8 py-1 hidden`}
              href={"/orders"}
            >
              <MdOutlineBorderColor size={19} /> Orders
            </Link>

            <Link
              className={`${
                pathname === "/profil/whislist" && "bg-[#00b88c] text-white"
              } flex gap-2 items-center text-lg font-medium px-8 py-1`}
              href={"/profil/whislist"}
            >
              <Whislist
                color={`${pathname === "/profil/whislist" ? "#FFFFFF" : "#000"}`}
                size={19}
              />{" "}
              Whislist
            </Link>

            <Link
              className={`${
                pathname === "/profil/notifikasi" && "bg-[#00b88c] text-white"
              } flex gap-2 items-center text-lg font-medium px-8 py-1 relative`}
              href={"/profil/notifikasi"}
            >
              <span
                className={`size-2 bg-red-500 absolute rounded-full top-[5%] right-[48.5%] ${
                  msgNotifData?.length > 0 ? "flex" : "hidden"
                } `}
              />
              <IoNotificationsOutline size={19} />
              Notifikasi
            </Link>

            <button
              ref={searchButtonRef}
              className={`flex gap-2 items-center text-lg font-medium px-8 py-1`}
              onClick={() => setSeeSearch(seeSearch ? false : true)}
            >
              <MdOutlineSearch size={20} /> Search
            </button>
          </div>
        </div>

        {/* Dasboard */}
        {(session?.user?.role === "Developer" || session?.user?.role === "Author") && (
          <div className="flex flex-col">
            <div className="z-10">
              <button
                className={`text-sm text-gray-400 pl-8 flex items-center gap-2 cursor-pointer`}
                onClick={() => setSeeDasboard(!seeDasboard)}
              >
                <DasboardIcon color="#9ca3af" size={15} />
                Dasboard{" "}
                <IoIosArrowDown
                  className={`${seeDasboard ? "" : "rotate-90"} ease-in-out duration-300`}
                  size={13}
                />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <div className="overflow-hidden">
                <div
                  className={`${
                    seeDasboard ? "translate-y-[0]" : "translate-y-[-101%]"
                  } flex flex-col duration-200 ease-in-out bg-white`}
                >
                  {session?.user?.role === "Developer" && (
                    <>
                      <Link
                        className={`${
                          pathname === "/profil/dasboard/users" && "bg-[#00b88c] text-white"
                        } flex gap-2 items-center text-lg font-medium px-8 py-1`}
                        href={"/profil/dasboard/users"}
                      >
                        <HiOutlineInbox size={20} />
                        User
                      </Link>
                      <Link
                        className={`${
                          pathname === "/profil/dasboard/inbox" && "bg-[#00b88c] text-white"
                        } flex gap-2 items-center text-lg font-medium px-8 py-1`}
                        href={"/profil/dasboard/inbox"}
                      >
                        <HiOutlineInbox size={20} />
                        Inbox
                      </Link>
                      <Link
                        className={`${
                          pathname === "/profil/dasboard/toko" && "bg-[#00b88c] text-white"
                        } flex gap-2 items-center text-lg font-medium px-8 py-1`}
                        href={"/profil/dasboard/toko"}
                      >
                        <BiStore size={20} />
                        My Store
                      </Link>
                    </>
                  )}
                  {(session?.user?.role === "Developer" || session?.user?.role === "Author") && (
                    <>
                      <Link
                        className={`${
                          pathname === "/profil/author/mybook" && "bg-[#00b88c] text-white"
                        } flex gap-2 items-center text-lg font-medium px-8 py-1`}
                        href={"/profil/author/mybook"}
                      >
                        <FaRegAddressBook size={20} />
                        Add Book
                      </Link>
                      <Link
                        className={`${
                          pathname === "/profil/author" && "bg-[#00b88c] text-white"
                        } flex gap-2 items-center text-lg font-medium px-8 py-1`}
                        href={"/profil/author"}
                      >
                        <SiBookmyshow size={20} />
                        My Book
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* OTHER */}
        <div
          className={`${
            seeDasboard
              ? ""
              : `${
                  session?.user?.role === "Developer" || session?.user?.role !== "Author"
                    ? "-mt-[11rem]"
                    : "-mt-[5rem]"
                }`
          } ${
            (status === "unauthenticated" ||
              (session?.user?.role !== "Developer" && session?.user?.role !== "Author")) &&
            "mt-[11px]"
          } duration-200 ease-in-out flex flex-col`}
        >
          <h4 className="text-sm text-gray-400 pl-8 flex items-center gap-2">
            <HiMiniBars3BottomRight size={15} />
            Other
          </h4>
          <div className="flex flex-col gap-2">
            <Link
              className={`${
                pathname === "/leaderboard" && "bg-[#00b88c] text-white"
              } flex gap-2 items-center text-lg font-medium px-8 py-1`}
              href={"/leaderboard"}
            >
              <MdOutlineLeaderboard size={20} />
              Leaderboard
            </Link>

            <hr className="w-full h-[1px] rounded-full border-0 bg-gray-400 px-5" />
            {session?.user && (
              <div
                className={`${
                  pathname === "/profil" && "bg-[#00b88c] text-white"
                } flex w-full justify-between px-8 items-center`}
              >
                <Link
                  className={`flex gap-2 items-center text-lg font-medium py-2`}
                  href={`/profil`}
                >
                  <LuUser size={20} />
                  Profil
                </Link>
                <button
                  className="h-max w-max"
                  type="button"
                  onClick={async () => {
                    await signOut({ callbackUrl: "/login" });
                  }}
                >
                  <TbLogout size={25} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Auth Button */}
        {status === "unauthenticated" && (
          <div className="flex flex-col gap-2 px-8">
            <button
              className="bg-[#00b88c] w-full rounded-lg font-semibold text-white text-center py-2"
              type="button"
              onClick={() => signIn()}
            >
              Log In
            </button>
            <Link
              className="flex items-center justify-between bg-[#00b88c] w-full rounded-lg font-semibold text-white text-center py-2 px-2"
              href={"/register"}
            >
              Sign Up{" "}
              <span className="bg-white p-2 text-[#00b88c] rounded-lg">
                <FaArrowRightLong size={15} />
              </span>
            </Link>
          </div>
        )}
      </div>
      {/*translate-x-[10rem]  */}
      {session?.user && !seeSearch && (
        <ButtonMission seeMission={seeMission} setSeeMission={setSeeMission} />
      )}
    </div>
  );
}

const ButtonMission = ({
  seeMission,
  setSeeMission,
}: {
  seeMission: boolean;
  setSeeMission: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [position, setPosition] = useState({ top: 23.5 });
  const [dragging, setDragging] = useState(false);

  const handleMouseDown = (e: any) => {
    setDragging(true);
    e.preventDefault();
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleMouseMove = (e: any) => {
    if (dragging) {
      const screenHeight = window.innerHeight;
      const buttonHeight = 30;
      const newTop = e.clientY - buttonHeight / 2;
      const boundedTop = Math.min(Math.max(newTop, 0), screenHeight - buttonHeight);
      setPosition({
        top: boundedTop,
      });
    }
  };

  useEffect(() => {
    if (dragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  return (
    <button
      className={`${seeMission ? "opacity-0 visibility-hidden" : "opacity-100 visibility-visible"} bg-white border-r border-y rounded-r-md top-[23.5px] md:left-72 left-0 fixed duration-150 ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
      style={{ top: `${position.top}px` }}
      onClick={() => setSeeMission(!seeMission)}
      onMouseDown={handleMouseDown}
    >
      <LuMenu size={30} />
    </button>
  );
};
