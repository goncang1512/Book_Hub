import useSWR from "swr";

import instance from "./fetch";

export const fetcher = (url: string) => instance.get(url).then((res) => res.data);

export const useUsers = {
  Leaderboard: () => {
    const { data, isLoading } = useSWR("/api/user/leaderboard", fetcher);

    return {
      userData: data?.result,
      userDataLoading: isLoading,
    };
  },
  detailUser: (id: string) => {
    const { data, isLoading } = useSWR(`/api/user?user_id=${id}`, fetcher);

    return {
      userDetail: data?.result,
      userDetailLoading: isLoading,
    };
  },
};

export const useBooks = {
  allBook: () => {
    const { data, error, isLoading } = useSWR("/api/book", fetcher);

    return {
      recomendedBook: data?.recomended,
      statusBook: data?.statusBook,
      books: data?.result,
      booksLoading: isLoading,
      bookError: error,
      jenisHot: data?.jenisHot,
    };
  },
  myBook: (id: string) => {
    const { data, error, isLoading } = useSWR(`/api/book/${id}`, fetcher);

    return {
      statusBook: data?.statusBook,
      myBooks: data?.result,
      myBooksLoading: isLoading,
      myBooksError: error,
    };
  },
  detailBook: (id: string) => {
    const { data, error, isLoading } = useSWR(`/api/book/detailbook/${id}`, fetcher);

    return {
      storyBook: data?.story,
      statusDetail: data?.statusBook,
      detailBook: data?.result,
      detailBookLoading: isLoading,
      detailBookError: error,
    };
  },
};

export const useStory = {
  getStoryUser: (id: string) => {
    const { data, error, isLoading } = useSWR(`/api/story/mystory/${id}`, fetcher);

    return {
      storyUser: data?.result,
      storyUserLoading: isLoading,
      storyUserError: error,
    };
  },
  detailStory: (id: string | null) => {
    const { data, isLoading } = useSWR(`/api/story/detailstory/${id}`, fetcher);

    return {
      storyBook: data?.story,
      storyDetail: data?.result,
      storyDetailLdl: isLoading,
    };
  },
};

export const useList: any = {
  getUser: (user_id: string) => {
    const { data, isLoading, error } = useSWR(`/api/whislist/${user_id}`, fetcher);

    return {
      statusBook: data?.statusBook,
      dataUserList: data?.result,
      dataUserListLoading: isLoading,
      dataUserListError: error,
    };
  },
};

export const useVerify = {
  get: (id: string | null) => {
    if (id) {
      const { data, isLoading } = useSWR(`/api/user/check/${id}`, fetcher);

      return {
        verifyData: data?.result,
        verifyLoading: isLoading,
      };
    }

    return {
      verifyData: null,
      verifyLoading: false,
    };
  },
};

export const useMyBook = {
  mybook: (user_id: string) => {
    const { data, isLoading } = useSWR(`/api/book/author/${user_id}`, fetcher);

    return {
      statusBook: data?.statusBook,
      myBookAut: data?.result,
      myBookLoading: isLoading,
    };
  },
};

export const useChapter = {
  detailBook: (id: string) => {
    const { data, isLoading } = useSWR(`/api/read/detail/${id}`, fetcher);

    return {
      submitChapter: data?.submitted,
      draftChapter: data?.draft,
      detailChapter: data?.result,
      detailChapterLoading: isLoading,
    };
  },
  readBook: (book_id: string, chapter: string) => {
    const { data, isLoading } = useSWR(`/api/read?id=${book_id}&chapter=${chapter}`, fetcher);

    return {
      bacaBuku: data?.result,
      bacaBukuLoading: isLoading,
    };
  },
  submitted: () => {
    const { data, isLoading } = useSWR(`/api/dasboard/submitted`, fetcher);

    return {
      dataChapter: data?.result,
      dataChapterLoading: isLoading,
    };
  },
};
