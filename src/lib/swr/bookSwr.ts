import useSWR from "swr";
import { fetcher } from "../utils/useSwr";

export const bookSWR = {
  allBook: (page: number, booksPerPage: number) => {
    const { data, error, isLoading } = useSWR(
      `/api/book/author?page=${page}&limit=${booksPerPage}`,
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
