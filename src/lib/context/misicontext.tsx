import React, { createContext } from "react";
import { MisiContextType } from "../utils/provider.type";
import instance from "../utils/fetch";

export const MisiContext = createContext<MisiContextType>({} as MisiContextType);

export default function MisiContextProvider({ children }: { children: React.ReactNode }) {
  const addMisiUser = async (user_id: string, mission_id: string, type: string) => {
    try {
      const res = await instance.post(`/api/mission`, { user_id, mission_id, type });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  return <MisiContext.Provider value={{ addMisiUser }}>{children}</MisiContext.Provider>;
}
