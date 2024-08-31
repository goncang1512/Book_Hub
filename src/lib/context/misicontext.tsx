import React, { createContext, useState } from "react";
import { MisiContextType } from "../utils/types/provider.type";
import instance from "../utils/fetch";
import { logger } from "../utils/logger";
import { useSWRConfig } from "swr";

export const MisiContext = createContext<MisiContextType>({} as MisiContextType);

export default function MisiContextProvider({ children }: { children: React.ReactNode }) {
  const { mutate } = useSWRConfig();
  const addMisiUser = async (user_id: string, mission_id: string, type: string) => {
    try {
      const res = await instance.post(`/api/mission`, { user_id, mission_id, type });
      if (res.data.status) {
        mutate(`/api/mission/${user_id}`);
        mutate(`/api/mission/create/${user_id}`);
        mutate(`/api/user/${user_id}`);
        mutate(`/api/mission/${user_id}`);
      }
    } catch (error) {
      logger.error(`${error}`);
    }
  };

  const [msgPoint, setMsgPoint] = useState({
    msg: 0,
    status: false,
    misi_id: "",
  });

  const claimMisi = async (misiUserId: string, point: number) => {
    try {
      const res = await instance.patch(`/api/mission/${misiUserId}`, { point });
      if (res.data.status) {
        mutate(`/api/user/${res.data.result.user_id}`);
        mutate(`/api/mission/${res.data.result.user_id}`);
        setMsgPoint({
          ...msgPoint,
          msg: res.data.player.point,
          status: res.data.status,
          misi_id: res.data.result.mission_id,
        });
        setTimeout(() => {
          setMsgPoint({
            ...msgPoint,
            msg: 0,
            status: false,
            misi_id: "",
          });
        }, 1000);
      }
    } catch (error) {
      logger.error(`${error}`);
    }
  };
  return (
    <MisiContext.Provider value={{ addMisiUser, claimMisi, msgPoint }}>
      {children}
    </MisiContext.Provider>
  );
}
