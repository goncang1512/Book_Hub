import React, { useState } from "react";
import { createContext } from "react";
import { useSWRConfig } from "swr";
import { useSession } from "next-auth/react";

import instance from "../utils/fetch";

import { dataUserType } from "@/components/fragments/baristable";
import { DasboardProps, EditStatus } from "../utils/DataTypes.type";
import { logger } from "../utils/logger";

export const DasboardContext = createContext<DasboardProps>({} as DasboardProps);

export default function DasboardContextProvider({ children }: { children: React.ReactNode }) {
  const { data: session }: any = useSession();
  const { mutate } = useSWRConfig();
  const [keyword, setKeyWord] = useState<string>("");
  const [dataUser, setDataUser] = useState<dataUserType | null>(null);
  const [msgSearchUser, setMsgSearchUser] = useState<{
    status: boolean;
    message: string;
  }>({
    status: false,
    message: "",
  });

  const updateRole = async (user_id: string, email: string, role: string) => {
    const data = {
      user_id,
      email,
      role,
    };
    try {
      const res = await instance.patch(`/api/dasboard`, data, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      if (res.data.status) {
        mutate("/api/user/leaderboard");
        mutate(`/api/message/${session?.user?._id}`);
        mutate(`/api/user?user_id=${res.data.result._id}`);
        mutate(`/api/mission/${session?.user?._id}`);
      }
    } catch (error) {
      logger.error(`${error}`);
    }
  };

  const searchUser = async (keyword: string) => {
    try {
      const res = await instance.get(`/api/dasboard?keyword=${keyword}`);

      if (res.data.status) {
        setDataUser(res.data.result);
      }
    } catch (error: any) {
      if (error.response.data) {
        setMsgSearchUser({
          status: true,
          message: error.response.data.message,
        });
        setTimeout(() => {
          setMsgSearchUser({
            status: false,
            message: "",
          });
        }, 3000);
      } else {
        logger.error(`${error}`);
      }
    }
  };

  const updateCanvas = async (id: string, editStatus: EditStatus, setNewDataChapter: any) => {
    try {
      const res = await instance.patch(`/api/dasboard/submitted/${id}`, editStatus);

      if (res.data.status) {
        mutate(`/api/dasboard/submitted`);
        mutate(`/api/message/${session?.user?._id}`);
        mutate(`/api/user?user_id=${res.data.result.user_id}`);
        mutate(`/api/mission/${session?.user?._id}`);
        setNewDataChapter(null);
      }
    } catch (error) {
      logger.error(`${error}`);
    }
  };

  return (
    <DasboardContext.Provider
      value={{
        updateRole,
        searchUser,
        keyword,
        setKeyWord,
        dataUser,
        msgSearchUser,
        updateCanvas,
      }}
    >
      {children}
    </DasboardContext.Provider>
  );
}
