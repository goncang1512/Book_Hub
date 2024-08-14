"use client";
import * as React from "react";
import { useContext } from "react";
import { useEffect } from "react";

import { ProfilBooksDekstop, BooksProfileMobile } from "@/components/layouts/contentBooksProfile";
import { useBooks } from "@/lib/utils/useSwr";
import { StoryContext } from "@/lib/context/storycontext";
import { CardContent } from "@/components/layouts/cardstory";
import { InputStory } from "@/components/layouts/inputstory";
import { PesanLvlUp } from "@/components/fragments/levelup";
import { useSession } from "next-auth/react";

export default function Content({ params }: { params: { slug: string[] } }) {
  const { data: session }: any = useSession();
  const { detailBook, dataFollow, storyBook, detailBookLoading, statusDetail } =
    useBooks.detailBook(params.slug[0], session?.user?._id);

  const { msgLvlUp } = useContext(StoryContext);
  useEffect(() => {
    if (msgLvlUp.lvlUp.status) {
      const modal: any = document.getElementById("modal_lvlup");
      modal?.showModal();
    }
  }, [msgLvlUp.lvlUp]);

  if (detailBookLoading) {
    return (
      <div className="flex w-full h-screen items-center justify-center">
        <span className="loading loading-bars loading-lg" />
      </div>
    );
  }

  return (
    <section className="flex">
      <div className="flex flex-col w-full md:mr-[38%] mr-0">
        <BooksProfileMobile dataBook={detailBook && detailBook} statusBook={statusDetail} />
        <div className="md:pt-0 pt-5">
          <InputStory idStoryBook={params.slug[0]} />
        </div>
        <div className="w-full">
          {detailBookLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <span className="loading loading-dots loading-md" />
            </div>
          ) : (
            storyBook &&
            storyBook.map((cerita: any) => {
              return (
                <CardContent
                  key={cerita._id}
                  dataFollow={dataFollow}
                  seeBook={false}
                  story={cerita}
                />
              );
            })
          )}
        </div>
      </div>

      {/* Card BOOK */}
      <ProfilBooksDekstop
        dataBook={detailBook && detailBook}
        statusBook={statusDetail && statusDetail}
      />
      <PesanLvlUp msgRank={msgLvlUp} />
    </section>
  );
}
