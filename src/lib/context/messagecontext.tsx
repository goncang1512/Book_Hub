import React, { createContext, Dispatch, SetStateAction, useState } from "react";
import { MessageContextType, SendType } from "../utils/types/provider.type";
import { logger } from "../utils/logger";
import instance from "../utils/fetch";
import { useSWRConfig } from "swr";

export const MessageContext = createContext<MessageContextType>({} as MessageContextType);

export default function MessageContextProvider({ children }: { children: React.ReactNode }) {
  const { mutate } = useSWRConfig();
  const [loadingMsg, setLoadingMsg] = useState(false);

  const sendMessage = async (
    dataMessage: SendType,
    setOpenModel: Dispatch<SetStateAction<any | null>>,
  ) => {
    try {
      setLoadingMsg(true);
      const res = await instance.post(`/api/message`, dataMessage);
      if (res.data.status) {
        setOpenModel(null);
        setLoadingMsg(false);
        mutate(`/api/mission/${dataMessage.recipientId}`);
      }
    } catch (error) {
      logger.error(`${error}`);
      setLoadingMsg(false);
    }
  };

  return (
    <MessageContext.Provider value={{ sendMessage, loadingMsg }}>
      {children}
    </MessageContext.Provider>
  );
}
