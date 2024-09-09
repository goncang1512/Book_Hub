import * as React from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useContext, useRef } from "react";

import { TextArea } from "../elements/textarea";
import { Button } from "../elements/button";
import Picture from "../elements/image";

import { StoryContext } from "@/lib/context/storycontext";

export const InputStory = ({
  idStoryBook,
  type,
  urlData,
}: {
  idStoryBook: string;
  type: string;
  urlData: string;
}) => {
  const { data: session, status }: any = useSession();
  const formRef = useRef<HTMLFormElement | null>(null);
  const { dataContent, setDataContent, loadingUploadStory, uploadStory, msgRank, msgUploadCerita } =
    useContext(StoryContext);
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

  return (
    <div className={`items-center gap-5 border-b w-full px-5 py-3`}>
      <form
        ref={formRef}
        className="w-full"
        onSubmit={(e) => {
          e.preventDefault();
          uploadStory(dataContent, session?.user?._id, idStoryBook && idStoryBook, type, urlData);
        }}
      >
        <table className="w-full">
          <tbody>
            <tr>
              <td className="w-16 flex items-start pt-[1.2rem] h-max">
                <div className="relative w-max flex flex-col justify-center items-center rounded-full">
                  <Picture
                    className="size-16 rounded-full border-2 border-gray-500"
                    src={session?.user?.imgProfil.imgUrl}
                  />
                  <p className="absolute bg-gray-500 text-white size-3 text-[8.5px] rounded-full p-2 text-center flex items-center justify-center text-xs border border-gray-500 bottom-0 translate-y-1/2">
                    {session?.user?.rank?.level}
                  </p>
                </div>
              </td>
              <td className="pr-5 pl-2 pt-[1.90rem]">
                {status === "unauthenticated" ? (
                  <Link className="italic text-blue-500" href={"/login"}>
                    Anda Harus login dulu!
                  </Link>
                ) : (
                  <TextArea
                    className="outline-1 w-full md:text-xl text-base min-h-[40px] rounded-lg p-2"
                    name="ception"
                    placeholder="Apa yang ingin anda ceritakan?"
                    value={dataContent}
                    onChange={(e) => setDataContent(e.target.value)}
                    onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                      if (!isMobile) {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          uploadStory(
                            dataContent,
                            session?.user?._id,
                            idStoryBook && idStoryBook,
                            type,
                            urlData,
                          );
                        }
                      }
                    }}
                  />
                )}
              </td>
            </tr>
            <tr className="">
              <td className="w-16" />
              <td className="flex justify-end items-center gap-5 relative pr-5">
                <p className="text-red-500 italic text-sm">{msgUploadCerita}</p>
                <Button
                  className={`${
                    loadingUploadStory || (status === "unauthenticated" && "cursor-not-allowed")
                  } rounded-full flex items-center justify-center`}
                  disabled={loadingUploadStory || status === "unauthenticated"}
                  label="buttonInputStory"
                  size="medium"
                  type="submit"
                  variant="posting"
                >
                  {loadingUploadStory ? (
                    <span className="loading loading-spinner loading-md" />
                  ) : (
                    "Posting"
                  )}
                </Button>
                <span
                  className={`${
                    msgRank.experience !== 0 &&
                    "-translate-y-3 opacity-0 transition-opacity duration-1000"
                  } absolute -top-5 right-12 text-sm text-red-500 italic`}
                >
                  {msgRank.experience !== 0 && `+${msgRank.point}`}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
};
