import { LikeContext } from "@/lib/context/likecontext";
import { usePathname } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

export default function ButtonFollow({
  user,
  follower_id,
  label,
  dataUser,
  session,
}: {
  user: any;
  follower_id: string;
  label: string;
  dataUser: any;
  session: any;
}) {
  const [followed, setFollowed] = useState(false);
  const { followUser, unfollowUser } = useContext(LikeContext);

  useEffect(() => {
    setFollowed(user?.follower.some((follow: any) => follow?.follower_id === follower_id));
  }, [user?.follower, follower_id]);

  return (
    <>
      {followed ? (
        <button
          aria-label={label}
          className="bg-stone-200 px-2 py-1 rounded-md text-black"
          onClick={() => {
            unfollowUser(user?._id, follower_id, user?.username, setFollowed);
          }}
        >
          unfollow
        </button>
      ) : (
        <button
          aria-label={label}
          className="bg-stone-200 px-2 py-1 rounded-md text-black"
          onClick={() => {
            followUser(user?._id, follower_id, user?.username, setFollowed);
          }}
        >
          {dataUser?.myFollower.some((follow: any) => follow?.user_id === session?.user?._id)
            ? "followback"
            : "follow"}
        </button>
      )}
    </>
  );
}

export const ButtonFriends = ({
  follower,
  dataUser,
  myFollower,
  session,
  dataFollow,
  label,
}: {
  follower: any;
  myFollower: any;
  dataUser: any;
  session: any;
  dataFollow: any;
  label: string;
}) => {
  const [followed, setFollowed] = useState(false);
  const { followUser, unfollowUser } = useContext(LikeContext);
  const pathaname = usePathname();

  useEffect(() => {
    const follownya = pathaname === "/profil" ? myFollower : dataFollow?.myFollower;
    const mengikuti = follownya?.some(
      (follow: any) =>
        follow.follower_id === session?.user?._id && follow?.user_id === dataUser?._id,
    );
    setFollowed(mengikuti);
  }, [follower]);

  return (
    <>
      {followed ? (
        <button
          aria-label={label}
          className="bg-stone-200 px-2 py-1 rounded-md text-black"
          onClick={() => {
            unfollowUser(dataUser?._id, session?.user?._id, dataUser?.username, setFollowed);
          }}
        >
          unfollow
        </button>
      ) : (
        <button
          aria-label={label}
          className="bg-stone-200 px-2 py-1 rounded-md text-black"
          onClick={() => {
            followUser(dataUser?._id, session?.user?._id, dataUser?.username, setFollowed);
          }}
        >
          {dataFollow?.follower?.some((follow: any) => follow.follower_id === dataUser?._id) ||
          pathaname === "/profil"
            ? "followback"
            : "follow"}
        </button>
      )}
    </>
  );
};

export const ButtonStory = ({
  user_id,
  follower_id,
  book_id,
  userData,
  dataFollow,
  session,
  label,
  chapterBook,
}: {
  user_id: string;
  follower_id: string;
  book_id: string;
  userData: any;
  dataFollow: any;
  session: any;
  label: string;
  chapterBook?: string | null;
}) => {
  const [followed, setFollowed] = useState(false);
  const { followUser, unfollowUser } = useContext(LikeContext);

  useEffect(() => {
    const mengikuti = dataFollow?.myFollower.some(
      (follow: any) =>
        follow.follower_id === session?.user?._id && follow?.user_id === userData?._id,
    );
    setFollowed(mengikuti);
  }, [dataFollow, userData]);

  return (
    <>
      {followed ? (
        <button
          aria-label={label}
          className="text-blue-500 text-sm"
          onClick={() => {
            unfollowUser(
              user_id,
              follower_id,
              userData?.username,
              setFollowed,
              book_id,
              chapterBook,
            );
          }}
        >
          Diikuti
        </button>
      ) : (
        <button
          aria-label={label}
          className="text-blue-500 text-sm"
          onClick={() => {
            followUser(user_id, follower_id, userData?.username, setFollowed, book_id, chapterBook);
          }}
        >
          {dataFollow?.follower?.some((follow: any) => follow.follower_id === userData?._id)
            ? "Ikuti kembali"
            : "ikuti"}
        </button>
      )}
    </>
  );
};
