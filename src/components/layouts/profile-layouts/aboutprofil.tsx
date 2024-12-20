import * as React from "react";
import { useSession } from "next-auth/react";
import { IoLocationOutline, IoCallOutline } from "react-icons/io5";
import { LogoRole } from "@public/svg/assets";
import Link from "next/link";
import { useEffect, useState } from "react";

import Picture from "../../elements/image";

import { StoryType } from "../cardstory";

import { UserType } from "@/lib/utils/types/DataTypes.type";
import ButtonFollow from "../../fragments/buttonfollow";
import { usePathname } from "next/navigation";
import InfiniteSwrStory from "../infiniteSwr";

interface StoryUser extends StoryType {
  length: number;
}

export default function AboutProfil({
  judul,
  userData,
  storysUser,
  dataFollow,
}: {
  judul: string;
  userData: UserType;
  storysUser: StoryUser[];
  dataFollow: any;
}) {
  const [width, setWidth] = useState("");
  const pathname = usePathname();
  const { data: session }: any = useSession();
  useEffect(() => {
    if (userData && userData.rank) {
      const calculatedWidth = (userData.rank.experience / (userData.rank.level * 100)) * 100;
      setWidth(calculatedWidth.toFixed(1));
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
      <div className="w-full bg-white dark:bg-primary-dark rounded-lg">
        <div className="w-full h-14 bg-white dark:bg-primary-dark p-3 rounded-t-lg border flex items-center justify-between">
          <div className="flex items-center gap-5">
            <h1 className="font-semibold">{judul}</h1>
            <div className="flex items-center gap-2">
              <p>Level {userData?.rank?.level}</p>
              <BarExp width={width} />
            </div>
          </div>
          <div>
            {pathname !== "/profil" && (
              <ButtonFollow
                dataUser={userData}
                follower_id={session?.user?._id}
                label={`buttonFollow${userData?._id}`}
                session={session}
                user={userData}
              />
            )}
          </div>
        </div>
        <div className="p-3 border-x border-b rounded-b-lg flex flex-wrap gap-4">
          {/* satu */}
          <div className="w-full flex items-start gap-2 border-b py-2">
            <div className="flex gap-5">
              <Link
                aria-label="linkToLeaderboard"
                className="flex flex-col justify-center items-center"
                href={"/leaderboard"}
              >
                <p className="font-medium text-xs">Musim</p>
                <Picture className="size-24" src={userData?.rank?.rankNow} />
                <p className="font-medium text-xs">
                  {newMyRank} {userData?.rank?.level}
                </p>
              </Link>
              <Link
                aria-label="linkLeaderboard"
                className="flex flex-col justify-center items-center"
                href={"/leaderboard"}
              >
                <p className="font-medium text-xs">Riwayat</p>
                <Picture className="size-24" src={userData?.rank?.rankTertinggi?.img} />
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
                  <p className="text-sm text-gray-900 dark:text-gray-300">
                    {userData?.alamat ? (
                      userData?.alamat
                    ) : (
                      <Link
                        aria-label="link-to-alamat"
                        className="text-blue-500"
                        href={"/profil/editprofil/biografi"}
                      >
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
                  <p className="text-sm text-gray-900 dark:text-gray-300">
                    {userData?.number ? (
                      userData?.number
                    ) : (
                      <Link
                        aria-label="link-add-number"
                        className="text-blue-500"
                        href={"/profil/editprofil/biografi"}
                      >
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
              <p className="text-sm text-gray-900 dark:text-gray-300">{userData?.role}</p>
            </div>
          </div>
        </div>
      </div>
      <div id="story_container">
        <StoryContainer dataFollow={dataFollow} storysUser={storysUser} user_id={userData?._id} />
      </div>
    </div>
  );
}

export const BarExp = ({ width }: { width: string }) => {
  const [showProgressPer, setShowProgressPer] = useState(false);
  function formatWidth(width: any) {
    const numericWidth = parseFloat(width);

    return numericWidth % 1 === 0
      ? numericWidth.toFixed(0)
      : numericWidth.toString().replace(".", ",");
  }

  return (
    <div className={`w-20 h-[5px] flex items-center justify-center relative`}>
      <progress
        className={`progress progress-info bg-gray-300  w-20 h-[5px]`}
        max="100"
        value={width}
        onMouseEnter={() => setShowProgressPer(true)}
        onMouseLeave={() => setShowProgressPer(false)}
      />

      <div
        className={`bg-info size-[7px] rounded-full absolute`}
        style={{ left: `calc(${width}% - 0.2rem)` }}
        onMouseEnter={() => setShowProgressPer(true)}
        onMouseLeave={() => setShowProgressPer(false)}
      >
        {showProgressPer && (
          <div
            className={`absolute bg-blue-500 -top-[20px] left-1/2 transform -translate-x-1/2 rounded-sm`}
          >
            <p className="text-[9px] px-1 text-white">{formatWidth(width)}%</p>
            <div
              className="h-2 w-[10.3px] absolute bg-blue-500 left-1/2 transform -translate-x-1/2"
              style={{ bottom: "-5.2px" }}
            >
              <span className="absolute h-[6px] w-2 bg-white dark:bg-primary-dark -bottom-[0.9px] -left-[2.7px] rounded-tr-full  z-10" />
              <span className="absolute h-[6px] w-2 bg-white dark:bg-primary-dark -bottom-[0.9px] -right-[2.7px] rounded-tl-full  z-10" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const StoryContainer = ({
  storysUser,
  dataFollow,
  user_id,
}: {
  storysUser: StoryUser[];
  dataFollow: any;
  user_id: string;
}) => {
  return (
    <div
      className={`${storysUser?.length === 0 && "hidden"} border bg-white dark:bg-primary-dark rounded-lg shadow-lg`}
    >
      <div className="w-full h-14 bg-white dark:bg-primary-dark p-3 rounded-t-lg border-b flex items-center gap-5">
        <h1 className="font-semibold">Story</h1>
      </div>
      <div className="">
        <InfiniteSwrStory
          dataFollow={dataFollow}
          seeBook={true}
          url={`/api/story/limit/user/${user_id}`}
        />
      </div>
    </div>
  );
};
