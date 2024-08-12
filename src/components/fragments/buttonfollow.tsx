import { LikeContext } from "@/lib/context/likecontext";
import React, { useContext, useEffect, useState } from "react";

export default function ButtonFollow({ user, follower_id }: { user: any; follower_id: string }) {
  const [followed, setFollowed] = useState(false);
  const { followUser, unfollowUser } = useContext(LikeContext);

  useEffect(() => {
    setFollowed(user?.follower.some((follow: any) => follow.follower_id === follower_id));
  }, [user?.follower, follower_id]);

  return (
    <>
      {followed ? (
        <button
          className="bg-stone-200 px-2 py-1 rounded-md text-black"
          onClick={() => {
            unfollowUser(user?._id, follower_id, user?.username, setFollowed);
          }}
        >
          unfollow
        </button>
      ) : (
        <button
          className="bg-stone-200 px-2 py-1 rounded-md text-black"
          onClick={() => {
            followUser(user?._id, follower_id, user?.username, setFollowed);
          }}
        >
          follow
        </button>
      )}
    </>
  );
}
