import useSWR from "swr";

import { fetcher } from "../utils/useSwr";

export const useMessage = {
  myMessage: (user_id: string) => {
    const { data, isLoading } = useSWR(`/api/message/${user_id}`, fetcher);

    return {
      messageData: data?.result,
      msgLoading: isLoading,
    };
  },
  msgDetail: (msg_id: string) => {
    const { data, isLoading } = useSWR(`/api/message/detail/${msg_id}`, fetcher);

    return {
      msgDetailData: data?.result,
      msgLoading: isLoading,
    };
  },
  msgNotif: (user_id: string) => {
    const { data, isLoading } = useSWR(`/api/message/notif/${user_id}`, fetcher);

    return {
      msgNotifData: data?.result,
      msgLoading: isLoading,
    };
  },
};
