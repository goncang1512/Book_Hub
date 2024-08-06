import useSWR from "swr";
import { fetcher } from "../utils/useSwr";

export const useMission = {
  getMission: (user_id: string) => {
    const { data, isLoading } = useSWR(`/api/mission/${user_id}`, fetcher);

    return {
      misiUser: data?.result,
      misiLoading: isLoading,
    };
  },
};
