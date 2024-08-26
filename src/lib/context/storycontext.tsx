import * as React from "react";
import { useState, createContext } from "react";
import { useSWRConfig } from "swr";
import { useSession } from "next-auth/react";

import instance from "../utils/fetch";
import { logger } from "../utils/logger";
import { StoryInterface } from "../utils/provider.type";
import { getKey } from "../swr/storySwr";
import { unstable_serialize } from "swr/infinite";

export const StoryContext = createContext<StoryInterface>({} as StoryInterface);

export default function StoryContextProvider({ children }: { children: React.ReactNode }) {
  const { mutate } = useSWRConfig();
  const { data: session }: any = useSession();
  const { update } = useSession();
  const [dataContent, setDataContent] = useState("");
  const [newCeption, setNewCeption] = useState("");
  const [msgUpdateCerita, setMsgStory] = useState("");
  const [msgUploadCerita, setMsgUploadCerita] = useState("");
  const [msgRank, setMsgRank] = useState({
    experience: 0,
    level: 0,
    point: 0,
  });

  const [msgLvlUp, setMsgLvlUp] = useState({
    experience: 0,
    level: 0,
    lvlUp: {
      message: "",
      status: false,
    },
  });

  const [loadingUploadStory, setLoadingUploadStory] = useState(false);
  const [loadingUpdateStory, setLoadingUpdateStory] = useState(false);
  const [loadingDeleteStory, setLoadingDeleteStory] = useState(false);

  const uploadStory = async (
    ception: string,
    id: string,
    bookId: string | null,
    type: string,
    urlData: string,
  ) => {
    try {
      setLoadingUploadStory(true);
      const res = await instance.post(
        "/api/story",
        { ception: ception, user_id: id, book_id: bookId, type },
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        },
      );

      if (res.data.status) {
        mutate(`/api/story/mystory/${id}`);
        mutate(`/api/story/detailstory/${bookId}`);
        mutate(`/api/book/detailbook/${bookId}`);
        mutate(`/api/mission/${session?.user?._id}`);
        mutate(`/api/book/detailbook/${bookId}/${session?.user?._id}`);
        mutate(`/api/story/detailstory/${bookId}/${session?.user?._id}`);
        mutate(
          unstable_serialize((pageIndex: any, previousPageData: any) =>
            getKey(pageIndex, previousPageData, urlData),
          ),
        );
        setDataContent("");
        update({
          status: "updateRank",
          rank: res.data.rank,
        });
        setMsgRank({
          ...msgRank,
          level: res.data.rank.level,
          experience: res.data.rank.experience,
          point: res.data.rank.point,
        });
        setTimeout(() => {
          setMsgRank({
            ...msgRank,
            level: 0,
            experience: 0,
            point: 0,
          });
        }, 1000);
        if (res.data.rank.levelUp) {
          setMsgLvlUp({
            ...msgLvlUp,
            level: res.data.rank.level,
            experience: res.data.rank.experience,
            lvlUp: {
              status: res.data.rank.levelUp.status,
              message: res.data.rank.levelUp.message,
            },
          });
          setTimeout(() => {
            setMsgLvlUp({
              ...msgLvlUp,
              level: 0,
              experience: 0,
              lvlUp: {
                status: false,
                message: "",
              },
            });
          }, 3000);
        }
      }
      setLoadingUploadStory(false);
    } catch (error: any) {
      if (error.response) {
        setMsgUploadCerita(error.response.data.message);
        setTimeout(() => {
          setMsgUploadCerita("");
        }, 3000);
      } else {
        logger.error(`${error}`);
      }
      setLoadingUploadStory(false);
    }
  };

  const deletedStory = async (id: string, bookId: string, urlData: string) => {
    try {
      setLoadingDeleteStory(true);
      const res = await instance.delete(`/api/story/${id}`);

      if (res.data.status) {
        mutate(`/api/story/${bookId}`);
        mutate(`/api/book/detailbook/${bookId}`);
        mutate(`/api/story/detailstory/${bookId}`);
        mutate(`/api/story/mystory/${res.data.result.user_id}`);
        mutate(`/api/book/detailbook/${bookId}/${session?.user?._id}`);
        mutate(`/api/story/detailstory/${bookId}/${session?.user?._id}`);
        mutate(`/api/user/content/${session?.user?._id}`);
        mutate(
          unstable_serialize((pageIndex: any, previousPageData: any) =>
            getKey(pageIndex, previousPageData, urlData),
          ),
        );
        setLoadingDeleteStory(false);
      }
    } catch (error) {
      logger.error(`${error}`);
      setLoadingDeleteStory(false);
    }
  };

  const updateStory = async (ception: string, id: string, book_id: string, urlData: string) => {
    try {
      setLoadingUpdateStory(true);
      const data = {
        ception: ception,
      };
      const res = await instance.patch(`/api/story/${id}`, data);
      if (res.data.status) {
        setLoadingUpdateStory(false);
        mutate(`/api/story/${res.data.result.book_id}`);
        mutate(`/api/story/mystory/${res.data.result.user_id}`);
        mutate(`/api/book/detailbook/${res.data.result.book_id}/${session?.user?._id}`);
        mutate(`/api/story/detailstory/${book_id}/${session?.user?._id}`);
        mutate(`/api/user/content/${session?.user?._id}`);
        mutate(
          unstable_serialize((pageIndex: any, previousPageData: any) =>
            getKey(pageIndex, previousPageData, urlData),
          ),
        );
      }
      return true;
    } catch (error: any) {
      setLoadingUpdateStory(false);
      if (error.response) {
        setMsgStory(error.response.data.message);
        setTimeout(() => {
          setMsgStory("");
        }, 3000);
      } else {
        logger.error(`${error}`);
      }
      return false;
    }
  };

  return (
    <StoryContext.Provider
      value={{
        dataContent,
        setDataContent,
        loadingUploadStory,
        uploadStory,
        deletedStory,
        loadingDeleteStory,
        newCeption,
        setNewCeption,
        loadingUpdateStory,
        updateStory,
        msgUpdateCerita,
        msgRank,
        msgUploadCerita,
        msgLvlUp,
        setMsgLvlUp,
      }}
    >
      {children}
    </StoryContext.Provider>
  );
}
