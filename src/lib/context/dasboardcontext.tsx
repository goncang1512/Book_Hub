import React, { SetStateAction, useState } from "react";
import { createContext } from "react";
import { useSWRConfig } from "swr";
import { useSession } from "next-auth/react";

import instance from "../utils/fetch";

import { dataUserType } from "@/components/fragments/baristable";

type EditStatus = {
  status: string;
  message: string;
  senderId: string;
  recipientId: string;
};

interface DasboardProps {
  updateRole: (user_id: string, email: string, role: string) => void;
  searchUser: (keyword: string) => void;
  keyword: string;
  setKeyWord: React.Dispatch<SetStateAction<string>>;
  dataUser: dataUserType | null;
  msgSearchUser: {
    status: boolean;
    message: string;
  };
  updateCanvas: (id: string, editStatus: EditStatus) => void;
}

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
        mutate(`/api/message/notif/${session?.user?._id}`);
      }
    } catch (error) {
      console.log(error);
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
        console.log(error);
      }
    }
  };

  const updateCanvas = async (id: string, editStatus: EditStatus) => {
    try {
      const res = await instance.patch(`/api/dasboard/submitted/${id}`, editStatus);

      if (res.data.status) {
        const modal = document.getElementById("modal_inbox") as HTMLDialogElement;
        modal.close();
        mutate(`/api/dasboard/submitted`);
        mutate(`/api/message/${session?.user?._id}`);
        mutate(`/api/user?user_id=${res.data.result.user_id}`);
        mutate(`/api/message/notif/${session?.user?._id}`);
      }
    } catch (error) {
      console.log(error);
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
