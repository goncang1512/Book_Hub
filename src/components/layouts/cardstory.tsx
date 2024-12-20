import * as React from "react";
import { useSession } from "next-auth/react";
import { useEffect, useState, useContext } from "react";
import Link from "next/link";
import { IconWriter } from "@public/svg/assets";
import { FiBook } from "react-icons/fi";
import { IoArrowRedoOutline, IoShareSocialOutline } from "react-icons/io5";
import { BiSolidLike, BiLike } from "react-icons/bi";
import { FaRegComments, FaXTwitter } from "react-icons/fa6";
import styles from "@/lib/style.module.css";
import {
  WhatsappShareButton,
  FacebookShareButton,
  TelegramShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  LineShareButton,
} from "react-share";
import { WhatsappIcon, FacebookIcon, TelegramIcon, LineIcon, LinkedinIcon } from "react-share";

import DetailStory from "../fragments/detailstory";
import Picture from "../elements/image";

import DropDown from "./hovercard";

import { GlobalState } from "@/lib/context/globalstate";
import ReadMoreLess from "@/components/elements/readmoreless";
import { LikeContext } from "@/lib/context/likecontext";
import { SpoilerText } from "@/components/elements/readmoreless";
import { StoryContext } from "@/lib/context/storycontext";
import { parseDate, timeAgo } from "@/lib/utils/parseTime";
import { Button } from "@/components/elements/button";
import { ButtonStory } from "../fragments/buttonfollow";
import ModalBox from "../fragments/modalbox";
import { pesanVar } from "@/lib/utils/pesanvariable";
import { ReportContext } from "@/lib/context/reportcontext";
import { usePathname } from "next/navigation";

export type StoryType = {
  _id: string;
  user_id: string;
  book_id: string;
  ception: string;
  type: string;
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
    terbit: Date;
    sinopsis: string;
    imgBooks: {
      public_id: string;
      imgUrl: string;
    };
  };
  like_str: any;
  balasanSum: any;
};

const report = [
  "Konten Tidak Pantas",
  "Penggunaan Bahasa Kasar atau Tidak Sopan",
  "Informasi Palsu atau Menyesatkan",
  "Spam atau Promosi",
  "Trolling atau Provokasi",
  "Out of Topic",
  "Penyalahgunaan Sistem Ulasan",
];

export const CardContent = ({
  story,
  seeBook,
  comment,
  dataFollow,
  statusCard,
  chapterBook,
  urlData,
  classStory,
}: {
  story: StoryType;
  seeBook: boolean;
  comment?: boolean;
  dataFollow: any;
  urlData: string;
  statusCard?: string;
  chapterBook?: string | null;
  classStory?: string;
}) => {
  const pahtname = usePathname();
  const { data: session }: any = useSession();
  const [handleUpdate, setHandleUpdate] = useState(false);
  const { isDarkMode } = useContext(GlobalState);
  const { makeReport } = useContext(ReportContext);
  const [modalBox, setModalBox] = useState<{ story_id: string } | null>(null);
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

  const [dataReport, setDataReport] = useState<any>(null);
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  const check = typeof story?.ception === "string" && story?.ception.includes("||");
  const paragraphs = story?.ception && story?.ception.split("\n");

  return (
    <div
      className={`${classStory} flex items-start justify-start p-5 gap-3 pr-3`}
      id="main-container"
    >
      <Link
        aria-label={`handlerouterUser${story?._id}`}
        className="relative w-max flex flex-col justify-center items-center rounded-full cursor-pointer"
        href={`/user/@${story?.user?.username}`}
      >
        <Picture
          className="size-14 rounded-full border-2 border-gray-500"
          src={story?.user?.imgProfil?.imgUrl}
        />
        <p className="absolute bg-gray-500 text-white size-3 text-[8.5px] rounded-full p-2 text-center flex items-center justify-center text-xs border border-gray-500 bottom-0 translate-y-1/2">
          {story?.user?.rank?.level}
        </p>
      </Link>

      <div className="flex flex-col items-start gap-3 w-full">
        <div className="w-full flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Link
                aria-label={`handlerouterStory${story?._id}`}
                className="flex items-center gap-2"
                href={`/user/@${story?.user?.username}`}
              >
                <p className="md:text-base text-sm font-semibold">{story?.user?.username}</p>
                <div className="flex items-center">
                  {story?.user?.badge?.map((logo: string, index: number) => (
                    <Picture key={index} className="size-4" src={logo} />
                  ))}
                </div>
              </Link>
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
            <DropDown label={story?._id}>
              <div className="flex flex-col w-full">
                <button
                  aria-label={`${story?._id}buttonReport`}
                  className="text-start"
                  onClick={() =>
                    setDataReport({
                      story_id: story?._id,
                      user_id: story?.user_id,
                    })
                  }
                >
                  Report
                </button>
                {dataReport && (
                  <ModalBox
                    dataModal={dataReport}
                    setDataModal={setDataReport}
                    story_id={story?._id}
                  >
                    <div className="flex flex-col justify-start">
                      {report.map((laporan: string, index: number) => (
                        <button
                          key={index}
                          aria-label={`${index}buttonLaporan${story?._id}`}
                          className="active:text-slate-300 text-base text-start"
                          onClick={() => {
                            makeReport(
                              {
                                user_id: session?.user?._id,
                                message: pesanVar.storyCard({
                                  username: story?.user?.username,
                                  story: story?.ception,
                                  link_id: story?.type === "balasan" ? story?.book_id : story?._id,
                                }),
                                from: "story",
                                report: laporan,
                              },
                              setDataReport,
                            );
                          }}
                        >
                          {laporan}
                        </button>
                      ))}
                    </div>
                  </ModalBox>
                )}
                {session?.user?._id === story?.user_id && (
                  <>
                    <button
                      aria-label={`deleteStory${story?._id}`}
                      className="active:text-gray-400 flex items-center justify-center w-auto whitespace-nowrap"
                      onClick={() => {
                        deletedStory(story?._id, story?.book_id, urlData);
                      }}
                    >
                      {loadingDeleteStory ? (
                        <span className="loading loading-dots loading-md" />
                      ) : (
                        "Delete story"
                      )}
                    </button>
                    <button
                      aria-label={`updateStory${story?._id}`}
                      className="active:text-gray-400 text-start w-auto whitespace-nowrap"
                      type="button"
                      onClick={() => setHandleUpdate(!handleUpdate)}
                    >
                      Edit Story
                    </button>
                  </>
                )}
              </div>
            </DropDown>
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
              const hasil = await updateStory(newCeption, story?._id, book_id, urlData);
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
                    const hasil = await updateStory(newCeption, story?._id, book_id, urlData);
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
          } flex gap-3 mt-2 border p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 w-full`}
        >
          <Link
            aria-label={`toBook-${story?._id}`}
            className="w-[62px] h-[114px]"
            href={`/content/${story?.book?._id}`}
          >
            <Picture
              className="w-[64px] h-[114px] rounded-lg object-cover border"
              src={story?.book?.imgBooks?.imgUrl}
            />
          </Link>
          <div className="flex flex-col justify-between w-full">
            <div className="flex w-full justify-between items-center">
              <Link aria-label={`toSeeBook-${story?._id}`} href={`/content/${story?.book?._id}`}>
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
                  <IconWriter color={isDarkMode ? "#ffffff" : "#000000"} size={20} /> Penulis:{" "}
                  {story?.book?.writer}
                </p>
                <p className="text-xs text-gray-500 md:flex hidden items-center">
                  {story?.book?.terbit && parseDate(story?.book?.terbit)}
                </p>
              </div>
            </div>
            <DetailStory>
              <p className="text-sm text-gray-500 flex gap-2 items-center">
                Penulis: {story?.book?.writer}
              </p>
              <p className="text-sm text-gray-500 flex gap-2 items-center">
                Terbit : {story?.book?.terbit && parseDate(story?.book?.terbit)}
              </p>
            </DetailStory>
          </div>
        </div>

        <div className="flex items-center justify-between w-full" id="like-component">
          <div className="flex items-center gap-3">
            <LikeComponent
              _id={story?._id}
              book_id={statusCard === "detail" ? story?._id : story?.book_id}
              chapterBook={chapterBook}
              contentLike={story?.like_str && story?.like_str}
              urlData={urlData}
              user={story?.user && story.user}
              user_story={story?.user_id && story?.user_id}
            />

            {!comment && (
              <div className="flex items-center gap-2">
                <Link
                  aria-label={`toCommentStory-${story?._id}`}
                  className={`flex`}
                  href={`/content?id=${story?._id}`}
                  // href={`${story?.type === "chapter" ? `/content?id=${story?._id}` : story?.book ? `/content?id=${story?._id}` : `/content?id=${story?.book_id}`}`}
                >
                  <FaRegComments size={25} />
                </Link>
                <p className="text-center text-sm text-gray-400">
                  {story?.balasanSum?.length > 0 && story?.balasanSum?.length}
                </p>
              </div>
            )}

            <Button
              label={`buttonShare-${story?._id}`}
              onClick={() => setModalBox({ story_id: story?._id })}
            >
              <IoShareSocialOutline size={25} />
            </Button>
          </div>
          {story?.type === "balasan" && pahtname === "/profil" && (
            <Link
              aria-label={`button-seemore-${story?._id}`}
              className="flex items-center gap-1 md:mr-5"
              href={`/content?id=${story?.book_id}`}
            >
              <IoArrowRedoOutline size={25} />
            </Link>
          )}
        </div>
      </div>
      <ModalShare modalBox={modalBox} setModalBox={setModalBox} story_id={modalBox?.story_id} />
    </div>
  );
};

const ModalShare = ({ modalBox, setModalBox, story_id }: any) => {
  return (
    <ModalBox dataModal={modalBox} setDataModal={setModalBox} story_id={story_id}>
      <div className="flex items-center gap-2">
        <WhatsappShareButton
          aria-label={`buttonWhats-${story_id}`}
          url={`${process.env.NEXT_PUBLIC_API_URL}/content?id=${story_id}`}
        >
          <WhatsappIcon borderRadius={100} size={50} />
        </WhatsappShareButton>
        <FacebookShareButton
          aria-label={`buttonFacebook-${story_id}`}
          url={`${process.env.NEXT_PUBLIC_API_URL}/content?id=${story_id}`}
        >
          <FacebookIcon borderRadius={100} size={50} />
        </FacebookShareButton>
        <TwitterShareButton
          aria-label={`buttonTwitter-${story_id}`}
          url={`${process.env.NEXT_PUBLIC_API_URL}/content?id=${story_id}`}
        >
          <div className="bg-black text-white rounded-full size-[50px] flex items-center justify-center">
            <FaXTwitter size={30} />
          </div>
        </TwitterShareButton>
        <TelegramShareButton
          aria-label={`buttonTelegram-${story_id}`}
          url={`${process.env.NEXT_PUBLIC_API_URL}/content?id=${story_id}`}
        >
          <TelegramIcon borderRadius={100} size={50} />
        </TelegramShareButton>
        <LinkedinShareButton
          aria-label={`buttonLinked-${story_id}`}
          url={`${process.env.NEXT_PUBLIC_API_URL}/content?id=${story_id}`}
        >
          <LinkedinIcon borderRadius={100} size={50} />
        </LinkedinShareButton>
        <LineShareButton
          aria-label={`buttonLine-${story_id}`}
          url={`${process.env.NEXT_PUBLIC_API_URL}/content?id=${story_id}`}
        >
          <LineIcon borderRadius={100} size={50} />
        </LineShareButton>
      </div>
    </ModalBox>
  );
};

const LikeComponent = ({
  _id,
  user_story,
  contentLike,
  book_id,
  user,
  urlData,
  chapterBook,
}: {
  _id: string;
  user_story: string;
  contentLike: any;
  book_id: string;
  user: any;
  urlData: string;
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
  const { isDarkMode } = useContext(GlobalState);
  const { data: session }: any = useSession();
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const data = contentLike?.some((like: any) => like.user_id === session?.user?._id);
    setLiked(data);
  }, [contentLike]);

  return (
    <div className="flex items-center gap-1">
      <button
        aria-label={`likeContent${_id}`}
        className={`flex items-center relative gap-1`}
        onClick={() => {
          if (liked) {
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
              urlData,
              chapterBook,
            );
          } else {
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
              urlData,
              chapterBook,
            );
          }
        }}
      >
        <div className={`${styles.checkmark} flex items-center justify-center size-[30px]`}>
          <BiLike
            className={`${styles.outline} ${isDarkMode ? "text-white" : "text-black"} absolute`}
            size={25}
            style={{ display: liked ? "none" : "block" }}
          />
          <BiSolidLike
            className={` text-blue-500 absolute ${styles.filled} `}
            size={25}
            style={{ display: liked ? "block" : "none" }}
          />

          <svg
            className={`${styles.celebrate}`}
            height="100"
            style={{ display: liked ? "block" : "none" }}
            width="100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polygon className={`stroke-[#3b82f6] fill-[#3b82f6]`} points="10,10 20,20" />
            <polygon className={`stroke-[#3b82f6] fill-[#3b82f6]`} points="10,50 20,50" />
            <polygon className={`stroke-[#3b82f6] fill-[#3b82f6]`} points="20,80 30,70" />
            <polygon className={`stroke-[#3b82f6] fill-[#3b82f6]`} points="90,10 80,20" />
            <polygon className={`stroke-[#3b82f6] fill-[#3b82f6]`} points="90,50 80,50" />
            <polygon className={`stroke-[#3b82f6] fill-[#3b82f6]`} points="80,80 70,70" />
          </svg>
        </div>
      </button>
      {contentLike?.length > 0 && (
        <p className="text-center text-sm text-gray-400">
          {contentLike?.length > 0 && contentLike?.length}
        </p>
      )}
    </div>
  );
};
