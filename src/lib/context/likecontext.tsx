import { useSession } from "next-auth/react";
import React, { createContext, SetStateAction } from "react";
import { useSWRConfig } from "swr";

import instance from "../utils/fetch";

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
      }
    } catch (error) {
      setLiked(false);
      console.log(error);
    }
  };

  const disLike = async (
    user_id: string,
    story_id: string,
    book_id: string,
    setLiked: React.Dispatch<SetStateAction<boolean>>,
  ) => {
    try {
      setLiked(false);
      await instance.delete(`/api/like/${user_id}/${story_id}`);
      mutate(`/api/book/detailbook/${book_id}`);
      mutate(`/api/story/detailstory/${book_id}`);
      mutate(`/api/user/content/${session?.user?._id}`);
    } catch (error) {
      console.log(error);
      setLiked(true);
    }
  };
  return <LikeContext.Provider value={{ addLike, disLike }}>{children}</LikeContext.Provider>;
}
