import useSWR from "swr";
import { fetcher } from "../utils/useSwr";

export const reportSWR = {
  getAll: () => {
    const { data, isLoading } = useSWR("/api/report", fetcher);

    return {
      dataReport: data?.result,
      reportLoading: isLoading,
    };
  },
};
