import useSWR from "swr";
import { fetcher } from "../utils/useSwr";

export const useNewUsers = {
  getDetailUser: (user_id: string) => {
    const shouldFetch = Boolean(user_id);
    const { data, isLoading } = useSWR(shouldFetch ? `/api/user/${user_id}` : null, fetcher);

    return {
      userDetail: data?.result,
      isLoading,
    };
  },
  getMisiNotif: (user_id: string) => {
    const shouldFetch = Boolean(user_id);
    const { data, isLoading } = useSWR(shouldFetch ? `/api/mission/${user_id}` : null, fetcher);

    return {
      missionUser: data?.mission,
      notifUser: data?.messageNotif,
      ldgMisiNotif: isLoading,
    };
  },
  getMyFollower: (user_id: string) => {
    const shouldFetch = Boolean(user_id);
    const { data, isLoading } = useSWR(shouldFetch ? `/api/follow/${user_id}` : null, fetcher);

    return {
      dataFollow: data?.result,
      followLoading: isLoading,
    };
  },
};
