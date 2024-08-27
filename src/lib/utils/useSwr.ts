import useSWR from "swr";

import instance from "./fetch";
import { useSession } from "next-auth/react";

export const fetcher = (url: string) => instance.get(url).then((res) => res.data);
export const axiosfetcher = (url: string, token: string) => {
  return instance
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data);
};

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
      booksUser: data?.books,
      storyUser: data?.storys,
      statusBook: data?.statusBook,
      userDetail: data?.result,
      userDetailLoading: isLoading,
    };
  },
  profilUser: (user_id: string) => {
    const { data, isLoading } = useSWR(`/api/user/content/${user_id}`, fetcher);

    return {
      userDetail: data?.userDetail,
      booksUser: data?.books,
      storysUser: data?.storys,
      statusBook: data?.statusBook,
      profilLoading: isLoading,
    };
  },
};

export const useBooks = {
  allBook: () => {
    const { data, error, isLoading } = useSWR(`/api/book`, fetcher);

    return {
      recomendedBook: data?.recomended,
      statusBook: data?.statusBook,
      booksLoading: isLoading,
      bookError: error,
      jenisHot: data?.jenisHot,
    };
  },
  detailBook: (id: string, user_id?: string) => {
    let url: string = `/api/book/detailbook/${id}`;
    if (user_id) {
      url = `/api/book/detailbook/${id}/${user_id}`;
    }
    const { data, error, isLoading } = useSWR(url, fetcher);

    return {
      dataFollow: data?.myFollower,
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
  detailStory: (id: string | null, user_id: string) => {
    let url: string = `/api/story/detailstory/${id}`;
    if (user_id) {
      url = `/api/story/detailstory/${id}/${user_id}`;
    }
    const { data, isLoading } = useSWR(url, fetcher);

    return {
      dataFollow: data?.myFollower,
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
  readBook: (book_id: string, chapter: string, user_id: string) => {
    let url: string = `/api/read?id=${book_id}&chapter=${chapter}`;
    if (user_id) {
      url = `/api/read?id=${book_id}&chapter=${chapter}&user_id=${user_id}`;
    }

    const { data, isLoading } = useSWR(url, fetcher);

    return {
      dataFollow: data?.myFollower,
      storyRead: data?.storys,
      bacaBuku: data?.result,
      bacaBukuLoading: isLoading,
    };
  },
  submitted: () => {
    const { data: session }: any = useSession();
    const { data, isLoading } = useSWR(session ? `/api/dasboard/submitted` : null, (url) =>
      axiosfetcher(url, session?.accessToken),
    );

    return {
      dataChapter: data?.result,
      dataChapterLoading: isLoading,
    };
  },
};
