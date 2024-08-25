import React, { SetStateAction } from "react";
import { createContext, useState } from "react";
import { useSWRConfig } from "swr";

import instance from "../utils/fetch";
import { logger } from "../utils/logger";
import { WhislistContextType } from "../utils/provider.type";

export const WhislistContext = createContext<WhislistContextType>({} as WhislistContextType);

export default function WhislistContextProvider({ children }: { children: React.ReactNode }) {
  const { mutate } = useSWRConfig();
  const [loadingHalaman, setLoadingHalaman] = useState(false);

  const addList = async (
    user_id: string,
    book_id: string,
    setIsLiked: React.Dispatch<SetStateAction<boolean>>,
    pagination?: { page: number; limit: number },
    keyword?: string,
  ) => {
    try {
      setIsLiked(true);
      const res = await instance.post("/api/whislist", { user_id, book_id });
      mutate("/api/book");
      mutate(`/api/whislist/${user_id}`);
      mutate(`/api/book/author/${user_id}`);
      mutate(`/api/book/${user_id}`);
      mutate(`/api/user/content/${user_id}`);
      mutate(`/api/user/${res.data.user._id}`);
      mutate(`/api/book/author?page=${pagination?.page}&limit=${pagination?.limit}`);
      mutate(`/api/search?title=${keyword}`);
    } catch (error) {
      logger.error(`${error}`);
      setIsLiked(false);
    }
  };

  const deleteList = async (
    user_id: string,
    book_id: string,
    setIsLiked: React.Dispatch<SetStateAction<boolean>>,
    pagination?: { page: number; limit: number },
    keyword?: string,
  ) => {
    try {
      setIsLiked(false);
      const res = await instance.delete(`/api/whislist/${book_id}/${user_id}`);
      mutate("/api/book");
      mutate(`/api/whislist/${user_id}`);
      mutate(`/api/book/author/${user_id}`);
      mutate(`/api/user/content/${user_id}`);
      mutate(`/api/user/${res.data.user._id}`);
      mutate(`/api/book/author?page=${pagination?.page}&limit=${pagination?.limit}`);
      mutate(`/api/search?title=${keyword}`);
    } catch (error) {
      logger.error(`${error}`);
      setIsLiked(true);
    }
  };

  const updateHalaman = async (book_id: string, halaman: { halaman: string }, user_id: string) => {
    try {
      setLoadingHalaman(true);
      const res = await instance.patch(`/api/whislist/${book_id}`, {
        halaman: halaman.halaman,
        user_id,
      });
      mutate(`/api/whislist/${res.data.result.user_id}`);
      setLoadingHalaman(false);
    } catch (error) {
      setLoadingHalaman(false);
      logger.error(`${error}`);
    }
  };
  return (
    <WhislistContext.Provider
      value={{
        addList,
        deleteList,
        updateHalaman,
        loadingHalaman,
      }}
    >
      {children}
    </WhislistContext.Provider>
  );
}
