"use client";
import * as React from "react";
import { useContext } from "react";
import { useSession } from "next-auth/react";
import { ElementProfil, ElementProfilDua } from "@public/svg/element";

import { HeaderProfil } from "@/components/layouts/profillayouts";
import AboutProfil from "@/components/layouts/aboutprofil";
import { GlobalState } from "@/lib/context/globalstate";
import { CardBook } from "@/components/layouts/cardstore";
import { useBooks } from "@/lib/utils/useSwr";

export default function Profil() {
  const { data: session }: any = useSession();
  const { seeProfilComponent } = useContext(GlobalState);
  const { myBooks, myBooksLoading, statusBook } = useBooks.myBook(session?.user?._id);

  return (
    <main
      className={`${
        myBooks?.length > 1
          ? `${seeProfilComponent.seeProduct && "h-full"}`
          : `${seeProfilComponent.seeProduct && "h-screen"}`
      }`}
    >
      <div className="relative h-full md:p-10 p-4 flex flex-col md:gap-10 gap-4 md:mr-[30%] mr-0">
        <HeaderProfil userData={session?.user} />
        {seeProfilComponent.seeAbout && <AboutProfil judul="About" userData={session?.user} />}
        {seeProfilComponent.seeFriends && <AboutProfil judul="Friends" userData={session?.user} />}
        {seeProfilComponent.seeProduct && (
          <div className="flex flex-wrap gap-4 w-full justify-start z-[10]">
            {myBooksLoading ? (
              <div className="flex w-full items-center justify-center">
                <span className="loading loading-dots loading-lg" />
              </div>
            ) : (
              myBooks &&
              myBooks.map((book: any) => (
                <CardBook
                  key={book._id}
                  dataContent={book}
                  statusBook={statusBook}
                  ukuran="w-full"
                />
              ))
            )}
          </div>
        )}

        <div className="absolute md:bottom-0 -bottom-[25px] -left-[30px] -z-10">
          <ElementProfilDua />
        </div>
      </div>

      <div className="absolute -top-[25px] right-0 -z-10">
        <ElementProfil />
      </div>
    </main>
  );
}
