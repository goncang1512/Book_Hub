import { storySWR } from "@/lib/swr/storySwr";
import React, { useEffect } from "react";
import { CardContent } from "./cardstory";

export default function InfiniteSwrStory({
  dataFollow,
  url,
  seeBook,
}: {
  dataFollow: any;
  url: string;
  seeBook: boolean;
}) {
  const { dataStory, size, setSize, isLoading } = storySWR.storyBook(url);

  const lastElement = dataStory && dataStory.at(-1);
  const totalPages = lastElement?.totalPages;

  useEffect(() => {
    setSize(1);
  }, []);

  return (
    <div className="w-full">
      {dataStory &&
        dataStory?.map((result: any) => {
          return result?.data?.map((cerita: any, index: number) => {
            return (
              <CardContent
                key={cerita._id}
                classStory={`${dataStory.length === 1 && index === 0 ? "border-none" : "border-t"}`}
                dataFollow={dataFollow}
                seeBook={seeBook}
                story={cerita}
                urlData={`${url}`}
              />
            );
          });
        })}
      <div
        className={`${totalPages < 1 || size === totalPages ? "hidden" : "flex"} w-full  items-center justify-center py-3`}
      >
        {isLoading ? (
          <span className="loading loading-spinner loading-md" />
        ) : (
          <button
            className="font-mono text-sm text-[#252525] px-2 py-1 uppercase rounded-lg border-2 border-[#252525] bg-white shadow-[3px_3px_0_#000] cursor-pointer active:shadow-none active:translate-x-[3px] active:translate-y-[3px]"
            onClick={() => setSize(size + 1)}
          >
            see more
          </button>
        )}
      </div>
    </div>
  );
}
