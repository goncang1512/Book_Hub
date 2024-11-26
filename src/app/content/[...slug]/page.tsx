"use client";
import * as React from "react";

import { ProfilBooksDekstop, BooksProfileMobile } from "@/components/layouts/contentBooksProfile";
import { useBooks } from "@/lib/utils/useSwr";
import { InputStory } from "@/components/layouts/inputstory";
import { useSession } from "next-auth/react";
import InfiniteSwrStory from "@/components/layouts/infiniteSwr";

export default function Content({ params }: { params: { slug: string[] } }) {
  const { data: session }: any = useSession();
  const { detailBook, dataFollow, detailBookLoading, statusDetail } = useBooks.detailBook(
    params.slug[0],
    session?.user?._id,
  );

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
          <InputStory
            idStoryBook={params.slug[0]}
            type="story"
            urlData={`/api/story/limit/${params.slug[0]}`}
          />
        </div>
        <InfiniteSwrStory
          dataFollow={dataFollow}
          seeBook={false}
          url={`/api/story/limit/${params.slug[0]}`}
        />
        <div className="py-2 flex items-center justify-center">
          <p className="text-xs text-[#c7c7c7]">© 2024 BookArcade from Mogo Studio</p>
        </div>
      </div>

      {/* Card BOOK */}
      <ProfilBooksDekstop
        dataBook={detailBook && detailBook}
        statusBook={statusDetail && statusDetail}
      />
    </section>
  );
}
