import useSWR from "swr";
import { fetcher } from "../utils/useSwr";

export const bookSWR = {
  allBook: (page: number, booksPerPage: number, shouldFetch: boolean) => {
    const { data, error, isLoading } = useSWR(
      shouldFetch ? `/api/book/author?page=${page}&limit=${booksPerPage}` : null,
      fetcher,
    );

    return {
      totalPage: data?.totalPage,
      statusPage: data?.statusBook,
      books: data?.result,
      pageLoading: isLoading,
      pageError: error,
    };
  },
};
