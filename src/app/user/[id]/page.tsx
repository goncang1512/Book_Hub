"use client";
import * as React from "react";
import { useContext } from "react";
import { ElementProfil, ElementProfilDua } from "@public/svg/element";

import { HeaderProfil } from "@/components/layouts/profillayouts";
import AboutProfil from "@/components/layouts/aboutprofil";
import { GlobalState } from "@/lib/context/globalstate";
import { CardBook } from "@/components/layouts/cardstore";
import { useUsers } from "@/lib/utils/useSwr";
import { useNewUsers } from "@/lib/swr/userswr";
import FriendsProfil from "@/components/layouts/friendsprofil";
import { useSession } from "next-auth/react";

interface UserProfilProps {
  params: {
    id: string;
  };
}

const UserProfil: React.FC<UserProfilProps> = ({ params }) => {
  const { seeProfilComponent } = useContext(GlobalState);
  const { data: session }: any = useSession();

  let username: string = "";
  if (params?.id) {
    const decodedId = decodeURIComponent(params?.id);
    const splitParams = decodedId.split("@");
    username = splitParams[1];
  }

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
              <AboutProfil judul="About" storysUser={storyUser} userData={userDetail} />
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

export default UserProfil;
