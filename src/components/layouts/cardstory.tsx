import * as React from "react";
import { useSession } from "next-auth/react";
import { useEffect, useState, useContext } from "react";
import Link from "next/link";
import { IconWriter } from "@public/svg/assets";
import { FiBook } from "react-icons/fi";
import { BiSolidLike, BiLike } from "react-icons/bi";
import { FaRegComments } from "react-icons/fa6";

import DetailStory from "../fragments/detailstory";
import Img from "../fragments/image";

import DropDown from "./hovercard";

import { GlobalState } from "@/lib/context/globalstate";
import ReadMoreLess from "@/components/elements/readmoreless";
import { LikeContext } from "@/lib/context/likecontext";
import { SpoilerText } from "@/components/elements/readmoreless";
import { StoryContext } from "@/lib/context/storycontext";
import { timeAgo } from "@/lib/utils/parseTime";
import { Button } from "@/components/elements/button";
import { ButtonStory } from "../fragments/buttonfollow";

export type StoryType = {
  _id: string;
  user_id: string;
  book_id: string;
  ception: string;
  user: {
    _id: string;
    username: string;
    email: string;
    badge: string[];
    rank: {
      level: number;
    };
    imgProfil: {
      public_id: string;
      imgUrl: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;
  book: {
    title: string;
    _id: string;
    writer: string;
    terbit: string;
    sinopsis: string;
    imgBooks: {
      public_id: string;
      imgUrl: string;
    };
  };
  like_str: any;
};

export const CardContent = ({
  story,
  seeBook,
  comment,
  dataFollow,
  statusCard,
  chapterBook,
}: {
  story: StoryType;
  seeBook: boolean;
  comment?: boolean;
  dataFollow: any;
  statusCard?: string;
  chapterBook?: string | null;
}) => {
  const { data: session }: any = useSession();
  const [handleUpdate, setHandleUpdate] = useState(false);
  const { handleRouter } = useContext(GlobalState);
  const {
    deletedStory,
    loadingDeleteStory,
    newCeption,
    setNewCeption,
    updateStory,
    msgUpdateCerita,
    loadingUpdateStory,
  } = useContext(StoryContext);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const searchContainer = document.getElementById("input-ception");
      const buttonSearch = document.getElementById("container-button");

      if (
        searchContainer &&
        !searchContainer.contains(event.target as Node) &&
        buttonSearch &&
        !buttonSearch.contains(event.target as Node)
      ) {
        setHandleUpdate(false);
      }
    };

    if (handleUpdate) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleUpdate]);

  useEffect(() => {
    if (handleUpdate) {
      setNewCeption(story?.ception);
    }
  }, [story?.ception, handleUpdate]);

  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  const check = typeof story?.ception === "string" && story?.ception.includes("||");
  const paragraphs = story?.ception && story?.ception.split("\n");
  return (
    <div className={`flex items-start justify-start border-b p-5 gap-3 pr-3`} id="main-container">
      <button
        aria-label="handlerouterUser"
        className="relative w-max flex flex-col justify-center items-center rounded-full cursor-pointer"
        onClick={() => handleRouter(story?.user?.username)}
      >
        <Img
          className="size-14 rounded-full border-2 border-gray-500"
          src={`${story?.user?.imgProfil?.imgUrl}`}
        />
        <p className="absolute bg-gray-500 text-white size-3 text-[8.5px] rounded-full p-2 text-center flex items-center justify-center text-xs border border-gray-500 bottom-0 translate-y-1/2">
          {story?.user?.rank?.level}
        </p>
      </button>

      <div className="flex flex-col items-start gap-3 w-full">
        <div className="w-full flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <button
                aria-label="handlerouterStory"
                className="flex items-center gap-2"
                onClick={() => handleRouter(story?.user?.username)}
              >
                <p className="md:text-base text-sm font-semibold">{story?.user?.username}</p>
                <div className="flex items-center">
                  {story?.user?.badge?.map((logo: string, index: number) => (
                    <Img key={index} className="size-4" src={`${logo}`} />
                  ))}
                </div>
              </button>
              {session?.user?._id !== story?.user?._id && (
                <ButtonStory
                  book_id={statusCard === "detail" ? story?._id : story?.book_id}
                  chapterBook={chapterBook}
                  dataFollow={dataFollow}
                  follower_id={session?.user?._id}
                  label={`buttonStory${story?._id}`}
                  session={session}
                  userData={story?.user}
                  user_id={story?.user?._id}
                />
              )}
            </div>
            <p className="md:text-sm text-xs text-gray-400">{timeAgo(story?.updatedAt)}</p>
          </div>

          <div className="md:pr-5" id="container-button">
            {session?.user?._id === story?.user_id && (
              <DropDown label={story?._id}>
                <button
                  aria-label="deleteStory"
                  className="active:text-gray-400 flex items-center jsutify-center"
                  onClick={() => {
                    deletedStory(story?._id, story?.book_id, chapterBook);
                  }}
                >
                  {loadingDeleteStory ? (
                    <span className="loading loading-spinner loading-md" />
                  ) : (
                    "Hapus cerita"
                  )}
                </button>
                <button
                  aria-label="updateStory"
                  className="active:text-gray-400 text-start"
                  type="button"
                  onClick={() => setHandleUpdate(!handleUpdate)}
                >
                  Edit Cerita
                </button>
              </DropDown>
            )}
          </div>
        </div>

        {/* Edit STORY */}
        {handleUpdate ? (
          <form
            className="w-full flex flex-col gap-4 md:pr-5"
            id="input-ception"
            onSubmit={async (e) => {
              e.preventDefault();
              const book_id = statusCard === "detail" ? story._id : story?.book_id;
              const hasil = await updateStory(
                newCeption,
                story?._id,
                book_id,
                chapterBook && chapterBook,
              );
              if (hasil) {
                setHandleUpdate(false);
              }
            }}
          >
            <textarea
              className="w-full border p-2 outline-none rounded-lg min-h-32"
              name=""
              placeholder="apa cerita kamu?"
              value={newCeption}
              onChange={(e) => {
                setNewCeption(e.target.value);
              }}
              onKeyDown={async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                if (!isMobile) {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    const book_id = statusCard === "detail" ? story._id : story?.book_id;
                    const hasil = await updateStory(
                      newCeption,
                      story?._id,
                      book_id,
                      chapterBook && chapterBook,
                    );
                    if (hasil) {
                      setHandleUpdate(false);
                    }
                  }
                }
              }}
            />
            <div className="w-full gap-5 flex justify-end items-center">
              {msgUpdateCerita && <p className="text-red-500 italic text-sm">{msgUpdateCerita}</p>}
              <Button
                className="rounded-full flex items-center justify-center"
                disabled={loadingUpdateStory}
                label={`buttonEditCerita${story?._id}`}
                size="medium"
                type="submit"
                variant="posting"
              >
                {loadingUpdateStory ? (
                  <span className="loading loading-spinner loading-md" />
                ) : (
                  "Edit Cerita"
                )}
              </Button>
            </div>
          </form>
        ) : check ? (
          <div className="md:pr-5 w-full">
            <SpoilerText>{story?.ception}</SpoilerText>
            {story?.createdAt !== story?.updatedAt && (
              <p className=" text-end text-xs text-gray-400">edited</p>
            )}
          </div>
        ) : (
          <div className="text-sm md:text-base md:pr-5 w-full">
            {paragraphs &&
              paragraphs.map((text: string, index) => <p key={index}>{text || "\u00A0"}</p>)}
            {story?.createdAt !== story?.updatedAt && (
              <p className=" text-end text-xs text-gray-400">edited</p>
            )}
          </div>
        )}

        {/* See Book */}
        <div
          className={`${
            story?.book ? `${seeBook ? "flex" : "hidden"}` : "hidden"
          } flex gap-3 mt-2 border p-3 rounded-lg bg-zinc-100 w-full`}
        >
          <Link className="w-[62px] h-[114px]" href={`/content/${story?.book?._id}`}>
            <Img
              className="w-[64px] h-[114px] rounded-lg object-cover border"
              src={`${story?.book?.imgBooks?.imgUrl}`}
            />
          </Link>
          <div className="flex flex-col justify-between w-full">
            <div className="flex w-full justify-between items-center">
              <Link href={`/content/${story?.book?._id}`}>
                <h1 className="font-semibold flex items-center gap-1">
                  <FiBook size={20} />
                  {story?.book?.title}
                </h1>
              </Link>
            </div>
            <div className="h-full py-1">
              <ReadMoreLess
                maxLength={210}
                mobile={150}
                other={false}
                text={story?.book?.sinopsis}
                textFont="md:text-sm text-xs"
              />
            </div>
            <hr className="h-[2px] bg-gray-500 rounded-full mb-1" />
            <div className="md:flex hidden  justify-between">
              <div className="flex w-full justify-between text-sm items-center">
                <p className="text-sm text-gray-500 flex gap-2 items-center">
                  <IconWriter size={20} /> Penulis: {story?.book?.writer}
                </p>
                <p className="text-xs text-gray-500 md:flex hidden items-center">
                  {story?.book?.terbit}
                </p>
              </div>
            </div>
            <DetailStory>
              <p className="text-sm text-gray-500 flex gap-2 items-center">
                Penulis: {story?.book?.writer}
              </p>
              <p className="text-sm text-gray-500 flex gap-2 items-center">
                Terbit : {story?.book?.terbit}
              </p>
            </DetailStory>
          </div>
        </div>

        <div className="flex items-center gap-3" id="like-component">
          <LikeComponent
            _id={story?._id}
            book_id={statusCard === "detail" ? story._id : story?.book_id}
            chapterBook={chapterBook}
            contentLike={story?.like_str && story.like_str}
            user={story.user && story.user}
            user_story={story?.user_id && story?.user_id}
          />

          {!comment && (
            <Link
              className={`flex`}
              href={`${
                story?.book ? `/content?id=${story?._id}` : `/content?id=${story?.book_id}`
              }`}
            >
              <FaRegComments size={25} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

const LikeComponent = ({
  _id,
  user_story,
  contentLike,
  book_id,
  user,
  chapterBook,
}: {
  _id: string;
  user_story: string;
  contentLike: any;
  book_id: string;
  user: any;
  chapterBook?: string | null;
}) => {
  const [likeContent, setLikeContent] = useState<{
    user_id: string;
    story_id: string;
  }>({
    user_id: "",
    story_id: "",
  });
  const { addLike, disLike } = useContext(LikeContext);
  const { data: session }: any = useSession();
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const data = contentLike?.some((like: any) => like.user_id === session?.user?._id);
    setLiked(data);
  }, [contentLike]);

  return (
    <>
      {liked ? (
        <button
          aria-label="dislikeStory"
          className="active:scale-125"
          onClick={() => {
            setLikeContent({
              ...likeContent,
              user_id: "hhgjhjhgj",
              story_id: "ljhjkhjhkjhkjh",
            });
            disLike(
              session?.user?._id,
              _id,
              book_id,
              setLiked,
              user_story,
              user?.username,
              chapterBook,
            );
          }}
        >
          <BiSolidLike className="text-blue-500" size={25} />
          <p className="text-center text-xs text-gray-400">{contentLike?.length}</p>
        </button>
      ) : (
        <button
          aria-label="likeStory"
          onClick={() => {
            setLikeContent({
              ...likeContent,
              user_id: session?.user?._id,
              story_id: _id,
            });
            addLike(
              session?.user?._id,
              _id,
              user_story,
              book_id,
              setLiked,
              user?.username,
              chapterBook,
            );
          }}
        >
          <BiLike size={25} />
          <p className="text-center text-xs text-gray-400">
            {contentLike?.length > 0 ? contentLike?.length : ""}
          </p>
        </button>
      )}
    </>
  );
};
