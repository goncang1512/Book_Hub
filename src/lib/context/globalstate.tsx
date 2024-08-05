"use client";
import * as React from "react";
import { createContext, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";

import instance from "@/lib/utils/fetch";

export const GlobalState = createContext<any>({} as any);

type ProfilComponent = {
  seeAbout: boolean;
  seeProduct: boolean;
  seeFriends: boolean;
  seeStory: boolean;
};

export default function GlobalStateProvider({ children }: { children: React.ReactNode }) {
  const { mutate } = useSWRConfig();
  const [detailUser, setDetailUser] = useState<any>();
  const [seeSearch, setSeeSearch] = useState<boolean>(false);
  const router = useRouter();
  const { data: session }: any = useSession();
  const [logIn, setLogIn] = useState<boolean>(false);
  const [seeProfilComponent, setSeeProfilComponent] = useState<ProfilComponent>({
    seeAbout: true,
    seeProduct: false,
    seeFriends: false,
    seeStory: false,
  });
  const [seeDetail, setSeeDetail] = useState("");
  const [seeMission, setSeeMission] = useState(false);

  const handleRouter = (username: string) => {
    if (session?.user?.username === username) {
      router.push("/profil");
    } else {
      router.push(`/user/@${username}`);
    }
  };

  const readMessage = async (msg_id: string) => {
    try {
      await instance.put(`/api/message/${msg_id}`);
      mutate(`/api/message/${session?.user?._id}`);
      mutate(`/api/message/notif/${session?.user?._id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const deletedMessage = async (msg_id: string) => {
    try {
      await instance.delete(`/api/message/${msg_id}`);
      mutate(`/api/message/${session?.user?._id}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <GlobalState.Provider
      value={{
        seeSearch,
        setSeeSearch,
        logIn,
        setLogIn,
        seeProfilComponent,
        setSeeProfilComponent,
        seeDetail,
        setSeeDetail,
        handleRouter,
        detailUser,
        setDetailUser,
        readMessage,
        deletedMessage,
        seeMission,
        setSeeMission,
      }}
    >
      {children}
    </GlobalState.Provider>
  );
}
