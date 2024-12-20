"use client";
import { useSearchParams } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import React from "react";

import { useStory } from "@/lib/utils/useSwr";
import { CardContent } from "@/components/layouts/cardstory";
import { InputStory } from "@/components/layouts/inputstory";
import { useSession } from "next-auth/react";
import InfiniteSwrStory from "@/components/layouts/infiniteSwr";

export default function Balasan() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  if (!id) {
    return <div>Loading</div>;
  }

  const { data: session }: any = useSession();
  const { storyDetail, dataFollow, storyBook, storyDetailLdl } = useStory.detailStory(
    id && id,
    session?.user?._id,
  );

  return (
    <main className="flex">
      {storyDetailLdl ? (
        <div className="w-screen h-screen flex items-center justify-center bg-white dark:bg-primary-dark md:mr-[38%] mr-0">
          <span className="loading loading-bars loading-lg" />
        </div>
      ) : (
        <div
          className={`flex flex-col w-full md:mr-[38%] mr-0 border-r ${
            storyBook?.length > 0 ? "h-full" : "h-screen"
          }`}
        >
          <div className="flex items-center border-b py-5 pl-2 gap-5 z-20 fixed top-0 md:left-[288px] left-0 bg-white dark:bg-primary-dark md:w-[50.2%] w-full">
            <button aria-labelledby="buttonBackPage" onClick={() => router.back()}>
              <FaArrowLeft size={25} />
            </button>
            <h1 className="text-xl font-bold">Story</h1>
          </div>

          <div className="flex flex-col pt-20">
            {storyDetail &&
              storyDetail?.map((cerita: any) => {
                return (
                  <CardContent
                    key={cerita._id}
                    classStory="border-b"
                    comment={true}
                    dataFollow={dataFollow}
                    seeBook={true}
                    statusCard="detail"
                    story={cerita}
                    urlData={`/api/story/limit/${id && id}`}
                  />
                );
              })}
            <InputStory
              idStoryBook={id && id}
              type="balasan"
              urlData={`/api/story/limit/${id && id}`}
            />
          </div>
          <InfiniteSwrStory
            dataFollow={dataFollow}
            seeBook={false}
            url={`/api/story/limit/${id && id}`}
          />
          <div className="py-2 flex items-center justify-center">
            <p className="text-xs text-[#c7c7c7]">© 2024 BookArcade from Mogo Studio</p>
          </div>
        </div>
      )}
      <div />
    </main>
  );
}
