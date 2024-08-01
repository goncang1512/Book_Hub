"use client";
import * as React from "react";
import { useContext } from "react";
import { ElementProfil, ElementProfilDua } from "@public/svg/element";

import { HeaderProfil } from "@/components/layouts/profillayouts";
import AboutProfil from "@/components/layouts/aboutprofil";
import { GlobalState } from "@/lib/context/globalstate";
import { CardBook } from "@/components/layouts/cardstore";
import { useUsers } from "@/lib/utils/useSwr";
import { UserType } from "@/lib/utils/DataTypes.type";

export type UserDetail = {
  userDetail: UserType;
  userDetailLoading: boolean;
};

export default function Profil({ params }: { params: { id: string } }) {
  const { seeProfilComponent } = useContext(GlobalState);
  const { userDetail, userDetailLoading }: UserDetail = useUsers.detailUser(params.id);
  const { booksUser, storysUser, profilLoading, statusBook } = useUsers.profilUser(params.id);

  if (userDetailLoading || profilLoading) {
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
        {userDetailLoading ? (
          <div className="flex h-screen w-full justify-center items-center">
            <span className="loading loading-bars loading-lg" />
          </div>
        ) : (
          <>
            <HeaderProfil userData={userDetail} />
            {seeProfilComponent.seeAbout && (
              <AboutProfil judul="About" storysUser={storysUser} userData={userDetail} />
            )}
            {seeProfilComponent.seeFriends && (
              <AboutProfil judul="Friends" storysUser={storysUser} userData={userDetail} />
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
          </>
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
