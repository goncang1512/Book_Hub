import React, { createContext } from "react";
import { MisiContextType } from "../utils/provider.type";
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
      }
    } catch (error) {
      logger.error(`${error}`);
    }
  };
  return <MisiContext.Provider value={{ addMisiUser }}>{children}</MisiContext.Provider>;
}
