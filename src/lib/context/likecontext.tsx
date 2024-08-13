import { useSession } from "next-auth/react";
import React, { createContext, Dispatch, SetStateAction } from "react";
import { useSWRConfig } from "swr";

import instance from "../utils/fetch";
import { logger } from "../utils/logger";

export const LikeContext = createContext<any>(null);

export default function LikeContextProvider({ children }: { children: React.ReactNode }) {
  const { mutate } = useSWRConfig();
  const { data: session }: any = useSession();

  const addLike = async (
    user_id: string,
    story_id: string,
    user_story: string,
    book_id: string,
    setLiked: React.Dispatch<SetStateAction<boolean>>,
    username: string,
  ) => {
    try {
      const data = {
        user_id,
        story_id,
        user_story,
      };
      setLiked(true);
      const res = await instance.post(`/api/like`, data);
      if (res.data.status) {
        mutate(`/api/book/detailbook/${book_id}`);
        mutate(`/api/story/detailstory/${book_id}`);
        mutate(`/api/user/content/${session?.user?._id}`);
        mutate(`/api/user/${res.data.user._id}`);
        mutate(`/api/mission/${session?.user?._id}`);
        mutate(`/api/user?user_id=${username}`);
        mutate(`/api/story/detailstory/${book_id}/${session?.user?._id}`);
        mutate(`/api/book/detailbook/${book_id && book_id}/${session?.user?._id}`);
        mutate(`/api/story/detailstory/${book_id}/${session?.user?._id}`);
      }
    } catch (error) {
      setLiked(false);
      logger.error(`${error}`);
    }
  };

  const disLike = async (
    user_id: string,
    story_id: string,
    book_id: string,
    setLiked: React.Dispatch<SetStateAction<boolean>>,
    user_story: string,
    username: string,
  ) => {
    try {
      setLiked(false);
      const res = await instance.delete(`/api/like/${user_id}/${story_id}/${user_story}`);
      if (res.data.status) {
        mutate(`/api/book/detailbook/${book_id}`);
        mutate(`/api/story/detailstory/${book_id}`);
        mutate(`/api/user/content/${session?.user?._id}`);
        mutate(`/api/user/${res.data.user._id}`);
        mutate(`/api/user?user_id=${username}`);
        mutate(`/api/book/detailbook/${book_id && book_id}/${session?.user?._id}`);
        mutate(`/api/story/detailstory/${book_id}/${session?.user?._id}`);
      }
    } catch (error) {
      logger.error(`${error}`);
      setLiked(true);
    }
  };

  const followUser = async (
    user_id: string,
    follower_id: string,
    username: string,
    setFollowed: Dispatch<SetStateAction<boolean>>,
    book_id?: string,
  ) => {
    try {
      setFollowed(true);
      const res = await instance.post(`/api/follow`, { user_id, follower_id });

      if (res.data.status) {
        mutate(`/api/user?user_id=${username}`);
        mutate(`/api/user/content/${follower_id}`);
        mutate(`/api/follow/${session?.user?._id}`);
        mutate(`/api/book/detailbook/${book_id && book_id}/${session?.user?._id}`);
        mutate(`/api/story/detailstory/${book_id}/${session?.user?._id}`);
      }
    } catch (error) {
      setFollowed(false);
      logger.error(`${error}`);
    }
  };

  const unfollowUser = async (
    user_id: string,
    follower_id: string,
    username: string,
    setFollowed: Dispatch<SetStateAction<boolean>>,
    book_id?: string,
  ) => {
    try {
      setFollowed(false);
      const res = await instance.delete(`/api/follow/${user_id}/${follower_id}`);
      if (res.data.status) {
        mutate(`/api/user?user_id=${username}`);
        mutate(`/api/user/content/${follower_id}`);
        mutate(`/api/user/content/${follower_id}`);
        mutate(`/api/follow/${session?.user?._id}`);
        mutate(`/api/book/detailbook/${book_id && book_id}/${session?.user?._id}`);
        mutate(`/api/story/detailstory/${book_id}/${session?.user?._id}`);
      }
    } catch (error) {
      logger.error(`${error}`);
      setFollowed(true);
    }
  };

  return (
    <LikeContext.Provider value={{ addLike, disLike, followUser, unfollowUser }}>
      {children}
    </LikeContext.Provider>
  );
}
