import { storySWR } from "@/lib/swr/storySwr";
import React, { useEffect } from "react";
import { CardContent } from "./cardstory";
import { Button } from "../elements/button";
import Adbanner from "../fragments/adbanner";

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
            const isAdPosition = (index + 1) % 5 === 0;
            return (
              <React.Fragment key={cerita._id}>
                <CardContent
                  classStory={`${dataStory.length === 1 && index === 0 ? "border-none" : "border-t"}`}
                  dataFollow={dataFollow}
                  seeBook={seeBook}
                  story={cerita}
                  urlData={`${url}`}
                />
                {isAdPosition && (
                  <div
                    className={`${dataStory.length === 1 && index === 0 ? "border-none" : "border-t"}`}
                  >
                    <Adbanner
                      dataAdFormat="auto"
                      dataAdSlot="7459232390"
                      dataFullWidthResponsive={true}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          });
        })}
      <div
        className={`${totalPages < 1 || size === totalPages ? "hidden" : "flex"} w-full  items-center justify-center py-3`}
      >
        {isLoading ? (
          <span className="loading loading-spinner loading-md" />
        ) : (
          <Button
            label="button-see-more"
            size="buttonClick"
            variant="buttonClick"
            onClick={() => setSize(size + 1)}
          >
            see more
          </Button>
        )}
      </div>
    </div>
  );
}
