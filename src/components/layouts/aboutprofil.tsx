import * as React from "react";
import { useSession } from "next-auth/react";
import { IoLocationOutline, IoCallOutline } from "react-icons/io5";
import { LogoRole } from "@public/svg/assets";
import Link from "next/link";
import { useEffect, useState } from "react";

import Img from "../fragments/image";

import { CardContent, StoryType } from "./cardstory";

import styles from "@/lib/style.module.css";
import { styleLvl } from "@/lib/utils";
import { UserType } from "@/lib/utils/DataTypes.type";

interface StoryUser extends StoryType {
  length: number;
}

export default function AboutProfil({
  judul,
  userData,
  storysUser,
}: {
  judul: string;
  userData: UserType;
  storysUser: StoryUser[];
}) {
  const [width, setWidth] = useState("");
  const { data: session }: any = useSession();
  useEffect(() => {
    if (userData && userData.rank) {
      const calculatedWidth = (userData.rank.experience / (userData.rank.level * 100)) * 100;
      setWidth(calculatedWidth.toFixed(0));
    }
  }, [userData?.rank?.level, userData?.rank?.experience]);

  let nameRank =
    userData?.rank?.rankTertinggi?.img === "/rank-satu.png"
      ? "Beginner Bookworm"
      : userData?.rank?.rankTertinggi?.img === "/rank-dua.png"
        ? "Intermediate Reader"
        : userData?.rank?.rankTertinggi?.img === "/rank-tiga.png"
          ? "Advanced Reader"
          : userData?.rank?.rankTertinggi?.img === "/rank-empat.png"
            ? "Elite Book "
            : "";

  let newMyRank =
    userData?.rank?.rankNow === "/rank-satu.png"
      ? "Beginner Bookworm"
      : userData?.rank?.rankNow === "/rank-dua.png"
        ? "Intermediate Reader"
        : userData?.rank?.rankNow === "/rank-tiga.png"
          ? "Advanced Reader"
          : userData?.rank?.rankNow === "/rank-empat.png"
            ? "Elite Book "
            : "";

  return (
    <div className="flex flex-col gap-5 scroll-smooth">
      <div className="w-full bg-white rounded-lg">
        <div className="w-full h-14 bg-white p-3 rounded-t-lg border flex items-center gap-5">
          <h1 className="font-semibold">{judul}</h1>
          <div className="flex items-center gap-2">
            <p>Level {userData?.rank?.level}</p>
            <BarExp width={width} />
          </div>
        </div>
        <div className="p-3 border-x border-b rounded-b-lg flex flex-wrap gap-4">
          {/* satu */}
          <div className="w-full flex items-start gap-2 border-b py-2">
            <div className="flex gap-5">
              <Link className="flex flex-col justify-center items-center" href={"/leaderboard"}>
                <p className="font-medium text-xs">Musim</p>
                <Img className="size-24" src={`${userData?.rank?.rankNow}`} />
                <p className="font-medium text-xs">
                  {newMyRank} {userData?.rank?.level}
                </p>
              </Link>
              <Link className="flex flex-col justify-center items-center" href={"/leaderboard"}>
                <p className="font-medium text-xs">Riwayat</p>
                <Img className="size-24" src={`${userData?.rank?.rankTertinggi?.img}`} />
                <p className="font-medium text-xs">
                  {nameRank} {userData?.rank?.rankTertinggi?.no}
                </p>
              </Link>
            </div>
          </div>
          {session?.user?._id === userData?._id && (
            <>
              {/* dua */}
              <div className="w-full flex items-center gap-2 border-b py-2">
                <IoLocationOutline className="text-blue-500" size={40} />
                <div className="flex flex-col">
                  <h1 className="font-semibold">Location</h1>
                  <p className="text-sm text-gray-900">
                    {userData?.alamat ? (
                      userData?.alamat
                    ) : (
                      <Link className="text-blue-500" href={"/profil/editprofil/biografi"}>
                        Tambahkan alamat di sini
                      </Link>
                    )}
                  </p>
                </div>
              </div>
              {/* tiga */}
              <div className="w-full flex items-center gap-2 border-b py-2">
                <IoCallOutline className="text-blue-500" size={40} />
                <div className="flex flex-col">
                  <h1 className="font-semibold">Phone Number</h1>
                  <p className="text-sm text-gray-900">
                    {userData?.number ? (
                      userData?.number
                    ) : (
                      <Link className="text-blue-500" href={"/profil/editprofil/biografi"}>
                        Tambahkan nomor HP di sini
                      </Link>
                    )}
                  </p>
                </div>
              </div>
            </>
          )}
          <div className="w-full flex items-center gap-2 py-2">
            <LogoRole color="#3b82f6" size={43} />
            <div className="flex flex-col">
              <h1 className="font-semibold">Role</h1>
              <p className="text-sm text-gray-900">{userData?.role}</p>
            </div>
          </div>
        </div>
      </div>
      <div id="story_container">
        <StoryContainer storysUser={storysUser} />
      </div>
    </div>
  );
}

export const BarExp = ({ width }: { width: string }) => {
  return (
    <div className={`bg-slate-400 w-20 h-[5px] relative rounded-lg ${styles.barExp} `}>
      <div
        className={`absolute left-0 top-0 bg-blue-500 h-full rounded-lg ${
          styleLvl[parseInt(width)]
        }`}
      >
        <div
          className={`${
            width === "0" && "opacity-0"
          } after:size-2 after:bg-blue-500 after:absolute after:right-0 after:-top-[1px] after:rounded-full after:content-[''] relative bg-green-500`}
        >
          <div className={`${styles.persenExp} hidden absolute right-[14.5px]`}>
            <div className="absolute flex items-center justify-center bg-blue-500 -top-5 rounded-sm px-[2px] text-[9px] text-white">
              {parseInt(width)}%
              <div className="h-2 w-2 absolute bg-blue-500 -bottom-[5px] left-[28%]">
                <span className="absolute h-[5px] w-1 bg-white bottom-0 left-0 rounded-tr-full border-none" />
                <span className="absolute h-[5px] w-1 bg-white bottom-0 right-0 rounded-tl-full border-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const StoryContainer = ({ storysUser }: { storysUser: StoryUser[] }) => {
  return (
    <div className={`${storysUser?.length === 0 && "hidden"} border bg-white rounded-lg shadow-lg`}>
      <div className="w-full h-14 bg-white p-3 rounded-t-lg border-b flex items-center gap-5">
        <h1 className="font-semibold">Story</h1>
      </div>
      {storysUser &&
        storysUser.map((story: StoryType) => {
          return <CardContent key={story._id} seeBook={true} story={story} />;
        })}
    </div>
  );
};
