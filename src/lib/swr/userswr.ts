import useSWR from "swr";
import { fetcher } from "../utils/useSwr";

export const useNewUsers = {
  getDetailUser: (user_id: string) => {
    const { data, isLoading } = useSWR(`/api/user/${user_id}`, fetcher);

    return {
      userDetail: data?.result,
      isLoading,
    };
  },
};
