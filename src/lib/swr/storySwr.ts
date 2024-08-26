import useSWRInfinite from "swr/infinite";
import { fetcher } from "../utils/useSwr";

export const getKey = (pageIndex: number, previousPageData: any, url: string) => {
  if (previousPageData && previousPageData.data && previousPageData.data.length === 0) return null;
  return `${url}?page=${pageIndex + 1}&limit=7`;
};

export const storySWR = {
  storyBook: (url: string) => {
    const { data, size, setSize, isLoading } = useSWRInfinite(
      (pageIndex, previousPageData) => getKey(pageIndex, previousPageData, url),
      fetcher,
      { revalidateAll: true },
    );

    return {
      dataStory: data,
      size,
      setSize,
      isLoading,
      getKey,
    };
  },
};
