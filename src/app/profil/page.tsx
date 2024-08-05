"use client";
import * as React from "react";
import { useContext } from "react";
import { useSession } from "next-auth/react";
import { ElementProfil, ElementProfilDua } from "@public/svg/element";

import { HeaderProfil } from "@/components/layouts/profillayouts";
import AboutProfil from "@/components/layouts/aboutprofil";
import { GlobalState } from "@/lib/context/globalstate";
import { CardBook } from "@/components/layouts/cardstore";
import { useUsers } from "@/lib/utils/useSwr";

export default function Profil() {
  const { data: session, status }: any = useSession();
  const { seeProfilComponent } = useContext(GlobalState);
  const { booksUser, storysUser, profilLoading, statusBook } = useUsers.profilUser(
    session?.user?._id,
  );

  if (status || profilLoading) {
    <div className="flex w-full items-center justify-center">
      <span className="loading loading-dots loading-lg" />
    </div>;
  }

  return (
    <main
      className={`${
        booksUser?.length > 1
          ? `${seeProfilComponent.seeProduct && "h-full"}`
          : `${seeProfilComponent.seeProduct && "h-screen"}`
      }`}
    >
      <div className="relative h-full md:p-10 p-4 flex flex-col md:gap-10 gap-4 md:mr-[30%] mr-0 z-10">
        <HeaderProfil userData={session?.user} />
        {seeProfilComponent.seeAbout && (
          <AboutProfil judul="About" storysUser={storysUser} userData={session?.user} />
        )}
        {seeProfilComponent.seeFriends && (
          <AboutProfil judul="Friends" storysUser={storysUser} userData={session?.user} />
        )}
        {seeProfilComponent.seeProduct && (
          <div className="flex flex-wrap gap-4 w-full justify-start">
            {booksUser &&
              booksUser.map((book: any) => (
                <CardBook
                  key={book._id}
                  dataContent={book}
                  statusBook={statusBook}
                  ukuran="w-full"
                />
              ))}
          </div>
        )}

        <div className="absolute md:bottom-0 -bottom-[25px] -left-[30px] -z-[1]">
          <ElementProfilDua />
        </div>
      </div>

      <div className="absolute -top-[25px] right-0">
        <ElementProfil />
      </div>
    </main>
  );
}