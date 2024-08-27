import { useSession } from "next-auth/react";
import useSWR from "swr";
import { axiosfetcher } from "../utils/useSwr";

export const useDasboard = {
  getDataUser: () => {
    const { data: session }: any = useSession();

    const { data, isLoading } = useSWR("/api/dasboard/submitted/user", (url) =>
      axiosfetcher(url, session?.accessToken),
    );

    return {
      userData: data?.result,
      userDataLoading: isLoading,
    };
  },
};
