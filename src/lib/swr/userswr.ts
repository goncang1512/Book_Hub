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
  getMisiNotif: (user_id: string) => {
    const { data, isLoading } = useSWR(`/api/mission/${user_id}`, fetcher);

    return {
      missionUser: data?.mission,
      notifUser: data?.messageNotif,
      ldgMisiNotif: isLoading,
    };
  },
  getMyFollower: (user_id: string) => {
    const { data, isLoading } = useSWR(`/api/follow/${user_id}`, fetcher);

    return {
      dataFollow: data?.result,
      followLoading: isLoading,
    };
  },
};
