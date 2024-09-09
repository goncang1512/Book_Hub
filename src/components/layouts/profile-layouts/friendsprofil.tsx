import React, { useContext, useState } from "react";
import Picture from "../../elements/image";
import { GlobalState } from "@/lib/context/globalstate";
import { useSession } from "next-auth/react";
import { ButtonFriends } from "../../fragments/buttonfollow";

type user = {
  _id: string;
  username: string;
  imgProfil: {
    public_id: string;
    imgUrl: string;
  };
  role: string;
  badge: string[];
};

// Follower Tipe Data
interface FollowerTypes {
  _id: string;
  user_id: string;
  follower_id: string;
  createdAt: string;
  updatedAt: string;
  user: user;
  follower: user;
}

export default function FriendsProfil({
  followerUser,
  myFollower,
  dataFollow,
}: {
  followerUser: FollowerTypes[];
  myFollower: FollowerTypes[];
  dataFollow?: any;
}) {
  const [seePengikut, setSeePengikut] = useState(true);
  const { data: session }: any = useSession();
  const { handleRouter } = useContext(GlobalState);
  const dataSee = seePengikut ? myFollower : followerUser;

  return (
    <div className="w-full h-full flex flex-col scroll-smooth">
      <div className="w-full h-14 bg-white p-3 rounded-t-lg border flex items-center justify-between">
        <div className="flex items-center gap-5">
          <h1 className="font-semibold">Friends</h1>
        </div>
        <div className="flex items-center">
          <button
            aria-label="buttonMengikuti"
            className={`${seePengikut && "text-[#0077B6]"}`}
            onClick={() => setSeePengikut(true)}
          >
            Mengikuti
          </button>
          <p className="px-2">|</p>
          <button
            aria-label="buttonDiikuti"
            className={`${!seePengikut && "text-[#0077B6]"}`}
            onClick={() => setSeePengikut(false)}
          >
            Diikuti
          </button>
        </div>
        <div>{/* <button>follow</button> */}</div>
      </div>
      <div className="bg-white border rounded-b-lg md:min-h-[12.4rem] min-h-[13rem]">
        {dataSee?.map((follow: FollowerTypes) => {
          const dataUser = seePengikut ? follow.user : follow.follower;
          return (
            <div
              key={follow._id}
              className="border-b p-3 flex items-center justify-between gap-2 w-full"
            >
              <button
                aria-label={`buttonseeUser${follow?._id}`}
                className="flex items-center justify-start w-full gap-2"
                onClick={() => handleRouter(dataUser.username)}
              >
                <Picture
                  className="md:size-20 size-14 rounded-full border"
                  src={dataUser.imgProfil?.imgUrl}
                />
                <div className="flex justify-center items-start flex-col leading-[15px]">
                  <div className="flex items-center gap-2">
                    <p className="md:text-base text-sm font-semibold">{dataUser.username}</p>
                    <div className="flex items-center">
                      {dataUser?.badge?.map((logo: string, index: number) => (
                        <Picture key={index} className="size-4" src={logo} />
                      ))}
                    </div>
                  </div>
                  <p className="md:text-sm text-xs text-gray-400">{dataUser.role}</p>
                </div>
              </button>
              {dataUser?._id !== session?.user?._id && (
                <ButtonFriends
                  dataFollow={dataFollow}
                  dataUser={dataUser}
                  follower={followerUser}
                  label={`buttonFriends${follow?._id}`}
                  myFollower={myFollower}
                  session={session}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
