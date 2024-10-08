"use client";
import * as React from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import parse from "html-react-parser";

import styles from "@/lib/style.module.css";
import { useMessage } from "@/lib/swr/message";
import HoverCard from "@/components/fragments/hoverbutton";
import Picture from "@/components/elements/image";
import { GlobalState } from "@/lib/context/globalstate";

export default function DetailMessage({ params }: { params: { msg_id: string } }) {
  const router = useRouter();
  const { msgDetailData, msgLoading } = useMessage.msgDetail(params.msg_id);
  const { readMessage, deletedMessage } = useContext(GlobalState);

  useEffect(() => {
    if (msgDetailData?.status) {
      readMessage(params.msg_id);
    }
  }, [params.msg_id, msgDetailData?.status]);

  return (
    <section className="flex">
      <main
        className={`relative flex flex-col w-full md:mr-[38%] mr-0 border-r h-screen overflow-y-hidden`}
      >
        {msgLoading ? (
          <div className="w-full h-screen flex justify-center items-center">
            <span className="loading loading-bars loading-md" />
          </div>
        ) : (
          <div className={`${styles.customScroll} flex-1 overflow-y-scroll`}>
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <Picture
                  className="size-16 border rounded-full"
                  src={msgDetailData?.user_id[0].imgProfil.imgUrl}
                />
                <div
                  className={`${
                    msgDetailData?.status && "font-bold text-black"
                  } flex items-center gap-2`}
                >
                  <h3 className="font-semibold">{msgDetailData?.user_id[0].username}</h3>

                  <div className="flex items-center">
                    {msgDetailData?.user_id[0].badge?.map((logo: string, index: number) => (
                      <Picture key={index} className="size-4" src={logo} />
                    ))}
                  </div>
                </div>
              </div>
              <HoverCard>
                <HoverCard.Content>
                  <div>
                    <button
                      aria-labelledby="buttonHapusnotif"
                      onClick={() => {
                        deletedMessage(msgDetailData?._id).then(() =>
                          router.push(`/profil/notifikasi`),
                        );
                      }}
                    >
                      Hapus
                    </button>
                  </div>
                </HoverCard.Content>
                <HoverCard.Trigger>
                  <HiOutlineDotsVertical size={25} />
                </HoverCard.Trigger>
              </HoverCard>
            </div>
            <div className="flex p-4">
              <p className={`text-black dark:text-white text-sm `}>
                {parse(msgDetailData?.message)}
              </p>
            </div>
          </div>
        )}
      </main>
      <div />
    </section>
  );
}
