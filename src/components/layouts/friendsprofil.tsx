import React, { useContext, useEffect, useState } from "react";
import Img from "../fragments/image";
import { GlobalState } from "@/lib/context/globalstate";
import { LikeContext } from "@/lib/context/likecontext";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

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
            className={`${seePengikut && "text-[#00b88c]"}`}
            onClick={() => setSeePengikut(true)}
          >
            Mengikuti
          </button>
          <p className="px-2">|</p>
          <button
            className={`${!seePengikut && "text-[#00b88c]"}`}
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
                className="flex items-center justify-start w-full gap-2"
                onClick={() => handleRouter(dataUser.username)}
              >
                <Img
                  className="size-20 rounded-full border"
                  src={`${dataUser.imgProfil?.imgUrl}`}
                />
                <div className="flex justify-center items-start flex-col leading-[15px]">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{dataUser.username}</p>
                    <div className="flex items-center">
                      {dataUser?.badge?.map((logo: string, index: number) => (
                        <Img key={index} className="size-4" src={`${logo}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">{dataUser.role}</p>
                </div>
              </button>
              {dataUser?._id !== session?.user?._id && (
                <ButtonFriends
                  dataFollow={dataFollow}
                  dataUser={dataUser}
                  follower={followerUser}
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

const ButtonFriends = ({
  follower,
  dataUser,
  myFollower,
  session,
  dataFollow,
}: {
  follower: any;
  myFollower: any;
  dataUser: any;
  session: any;
  dataFollow: any;
}) => {
  const [followed, setFollowed] = useState(false);
  const { followUser, unfollowUser } = useContext(LikeContext);
  const pathaname = usePathname();

  useEffect(() => {
    const follownya = pathaname === "/profil" ? myFollower : dataFollow.myFollower;
    const mengikuti = follownya.some(
      (follow: any) =>
        follow.follower_id === session?.user?._id && follow?.user_id === dataUser?._id,
    );
    setFollowed(mengikuti);
  }, [follower]);

  return (
    <>
      {followed ? (
        <button
          className="bg-stone-200 px-2 py-1 rounded-md text-black"
          onClick={() => {
            unfollowUser(dataUser?._id, session?.user?._id, dataUser?.username, setFollowed);
          }}
        >
          unfollow
        </button>
      ) : (
        <button
          className="bg-stone-200 px-2 py-1 rounded-md text-black"
          onClick={() => {
            followUser(dataUser?._id, session?.user?._id, dataUser?.username, setFollowed);
          }}
        >
          follow
        </button>
      )}
    </>
  );
};
