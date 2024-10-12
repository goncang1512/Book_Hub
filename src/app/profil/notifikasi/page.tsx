"use client";
import * as React from "react";
import Link from "next/link";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { useSession } from "next-auth/react";
import { useContext } from "react";

import Picture from "@/components/elements/image";
import styles from "@/lib/style.module.css";
import HoverCard from "@/components/fragments/hoverbutton";
import { useMessage } from "@/lib/swr/message";
import { GlobalState } from "@/lib/context/globalstate";

const extractText = (htmlString: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  return doc.body.textContent || "";
};

export default function Read() {
  const { data: session }: any = useSession();
  const { messageData, msgLoading } = useMessage.myMessage(session?.user?._id);
  const { readMessage, deletedMessage } = useContext(GlobalState);

  return (
    <section className="flex">
      <main
        className={`relative flex flex-col w-full md:mr-[38%] mr-0 border-r ${messageData?.length > 6 ? "h-full" : "h-screen"}`}
      >
        {msgLoading ? (
          <div className="w-full h-screen flex justify-center items-center">
            <span className="loading loading-bars loading-md" />
          </div>
        ) : (
          <div>
            <div className="md:hidden bg-white dark:bg-primary-black flex items-center border-b py-5 pl-2 gap-5 z-20 fixed top-0 md:left-[288px] left-0 md:w-[50.2%] w-full">
              <h1 className="text-xl font-bold">Notification</h1>
            </div>
            {messageData && (
              <div className={`${styles.customScroll} flex-1 md:pt-0 pt-[70px]`}>
                {messageData &&
                  messageData.map((pesan: any) => {
                    return (
                      <div
                        key={pesan._id}
                        className="flex items-center justify-between p-4 border-b"
                      >
                        <Link
                          className="flex items-center gap-3"
                          href={`/profil/notifikasi/${pesan._id}`}
                        >
                          <Picture
                            className="md:size-20 size-14 border rounded-full"
                            src={pesan.user_id[0].imgProfil.imgUrl}
                          />
                          <div
                            className={`${pesan.status && "font-bold text-black dark:text-white"}`}
                          >
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold md:text-base text-sm">
                                {pesan?.user_id[0].username}
                              </h3>
                              <div className="flex items-center">
                                {pesan?.user_id[0].badge?.map((logo: string, index: number) => (
                                  <Picture key={index} className="size-4" src={logo} />
                                ))}
                              </div>
                            </div>
                            <p
                              className={`${
                                pesan.status ? "text-black dark:text-gray-300" : "text-gray-400"
                              } md:text-sm text-xs truncate md:w-96 w-40 `}
                            >
                              {extractText(pesan?.message)}
                            </p>
                          </div>
                        </Link>
                        <HoverCard>
                          <HoverCard.Content>
                            <div>
                              <button
                                aria-labelledby={`buttonHapusNotif${pesan?._id}`}
                                className="active:text-gray-400"
                                onClick={() => deletedMessage(pesan._id)}
                              >
                                Hapus
                              </button>
                              <button
                                aria-labelledby={`sudahBaca${pesan?._id}`}
                                className="active:text-gray-400"
                                onClick={() => readMessage(pesan._id)}
                              >
                                Sudah di baca
                              </button>
                            </div>
                          </HoverCard.Content>
                          <HoverCard.Trigger>
                            <HiOutlineDotsVertical size={25} />
                          </HoverCard.Trigger>
                        </HoverCard>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}
      </main>
      <div />
    </section>
  );
}
