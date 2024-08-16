"use client";
import AboutProfil from "@/components/layouts/aboutprofil";
import { CardBook } from "@/components/layouts/cardstore";
import FriendsProfil from "@/components/layouts/friendsprofil";
import { HeaderProfil } from "@/components/layouts/profillayouts";
import { GlobalState } from "@/lib/context/globalstate";
import { useNewUsers } from "@/lib/swr/userswr";
import { useUsers } from "@/lib/utils/useSwr";
import { ElementProfil, ElementProfilDua } from "@public/svg/element";
import { useSession } from "next-auth/react";
import React, { useContext } from "react";

interface TesComponenType {
  username: string;
}

const ComponentUser: React.FC<TesComponenType> = ({ username }) => {
  const { seeProfilComponent } = useContext(GlobalState);
  const { data: session }: any = useSession();

  const { userDetail, userDetailLoading, booksUser, storyUser, statusBook } =
    useUsers.detailUser(username);
  const { dataFollow, followLoading } = useNewUsers.getMyFollower(session?.user?._id);
  return (
    <main
      className={`${
        booksUser?.length > 1
          ? `${seeProfilComponent?.seeProduct && "h-full"}`
          : `${seeProfilComponent?.seeProduct && "h-screen"}`
      }`}
    >
      <div className="relative h-full md:p-10 p-4 flex flex-col md:gap-10 gap-4 md:mr-[30%] mr-0 z-10">
        {userDetailLoading || followLoading ? (
          <div className="flex h-screen w-full justify-center items-center">
            <span className="loading loading-bars loading-lg" />
          </div>
        ) : (
          <>
            <HeaderProfil userData={userDetail} />
            {seeProfilComponent?.seeAbout && (
              <AboutProfil
                dataFollow={dataFollow}
                judul="About"
                storysUser={storyUser}
                userData={userDetail}
              />
            )}
            {seeProfilComponent?.seeFriends && (
              <FriendsProfil
                dataFollow={dataFollow}
                followerUser={userDetail?.follower}
                myFollower={userDetail.myFollower}
              />
            )}
            {seeProfilComponent?.seeProduct && (
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
};

export default ComponentUser;
