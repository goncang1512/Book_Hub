import * as React from "react";
import { useContext } from "react";
import { CiCamera } from "react-icons/ci";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

import Img from "../fragments/image";

import DropDown from "./hovercard";

import { GlobalState } from "@/lib/context/globalstate";
import styles from "@/lib/style.module.css";
import { UserContext } from "@/lib/context/usercontext";
import { UserType } from "@/lib/utils/types/DataTypes.type";

export function HeaderProfil({ userData }: { userData: UserType }) {
  const { data: session }: any = useSession();
  const { seeProfilComponent, setSeeProfilComponent } = useContext(GlobalState);
  const { deleteAccount } = useContext(UserContext);
  const { seeAbout, seeFriends, seeProduct } = seeProfilComponent;

  const buttonStyle = `${
    seeAbout && "after:w-[48px] after:-translate-x-[120px]"
  } ${seeFriends && "after:w-[58px] after:-translate-x-[56px]"} ${seeProduct && "after:w-[47px]"}`;

  return (
    <div className="flex flex-col items-center w-full relative z-[20]">
      <div
        className="h-[40vh] w-full bg-cover object-cover bg-center bg-blend-multiply rounded-t-lg"
        style={{
          backgroundImage: "url('/new-cover-profil.png')",
        }}
      />
      <div className="h-16 white border shadow-lg w-full rounded-b-lg" />
      <div className="absolute left-0 pl-5 md:bottom-[0.7rem] bottom-[1rem] flex items-center gap-5 w-full">
        <Img
          className="md:size-28 size-20 rounded-full border"
          src={`${userData?.imgProfil?.imgUrl}`}
        />

        <div className="flex flex-col gap-11 w-full relative bg-white">
          <div className="flex w-full items-center justify-between absolute pr-5 md:bottom-1 bottom-3">
            <div className="bg-white px-2 rounded-lg py-1 flex items-center gap-2">
              <h1 className="font-bold text-black md:text-base text-sm">{userData?.username}</h1>
              <div className="flex items-center">
                {userData?.badge?.map((logo: string, index: number) => (
                  <Img key={index} className="size-4" src={`${logo}`} />
                ))}
              </div>
            </div>
            <button
              className="hidden items-center gap-1 p-2 rounded-lg text-white text-sm"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            >
              <CiCamera size={20} />
              Edit Cover
            </button>
          </div>

          <div className="flex items-center justify-between pr-5 absolute md:top-[1.29rem] top-[0.7rem] w-full bg-white">
            <div
              className={`${styles.containerButton}  flex items-center gap-2 font-semibold text-gray-800 ease-in-out duration-200 relative ${buttonStyle}`}
            >
              <button
                aria-label="buttonSeeAbout"
                type="button"
                onClick={() =>
                  setSeeProfilComponent({
                    ...seeProfilComponent,
                    seeAbout: true,
                    seeFriends: false,
                    seeProduct: false,
                    seeStory: false,
                  })
                }
              >
                About
              </button>
              <button
                aria-label="seeFriends"
                type="button"
                onClick={() =>
                  setSeeProfilComponent({
                    ...seeProfilComponent,
                    seeAbout: false,
                    seeFriends: true,
                    seeProduct: false,
                    seeStory: false,
                  })
                }
              >
                Friends
              </button>
              <button
                aria-label="seeProduct"
                type="button"
                onClick={() =>
                  setSeeProfilComponent({
                    ...seeProfilComponent,
                    seeAbout: false,
                    seeFriends: false,
                    seeProduct: true,
                    seeStory: false,
                  })
                }
              >
                Books
              </button>
            </div>
            {session?.user?._id === userData?._id && (
              <DropDown label={userData?._id}>
                <div className="flex flex-col gap-2 z-40">
                  <Link className="active:text-gray-400" href={"/setting"}>
                    Setting
                  </Link>
                  <Link className="active:text-gray-400" href={"/profil/upload"}>
                    Upload books
                  </Link>
                  <button
                    aria-label="deleteAccount"
                    className="text-start w-max"
                    onClick={() => {
                      const confirm = window.confirm("Apakah Anda yakin ingin menghapus akun?");
                      if (confirm) {
                        deleteAccount(userData?._id);
                      }
                    }}
                  >
                    Delete Account
                  </button>
                  <button
                    aria-labelledby="buttonLogout"
                    className="text-start w-max"
                    onClick={async () => {
                      await signOut({ callbackUrl: "/login" });
                    }}
                  >
                    Log Out
                  </button>
                </div>
              </DropDown>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
