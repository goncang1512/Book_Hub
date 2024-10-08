/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect, useRef, useContext, SetStateAction } from "react";
import { FaRegEdit } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { useSession } from "next-auth/react";

import Picture from "../elements/image";
import { ModalBadge } from "./modalbadge";

import { formatDate } from "@/lib/utils/parseTime";
import { DasboardContext } from "@/lib/context/dasboardcontext";
import { GlobalState } from "@/lib/context/globalstate";
import { Button } from "../elements/button";
import JoditText from "./JoditEditor";
import { RiCloseLine } from "react-icons/ri";
import { MessageContext } from "@/lib/context/messagecontext";
import Link from "next/link";

export type dataUserType = {
  username: string;
  _id: string;
  email: string;
  role: string;
  createdAt: Date;
  badge: string[];
  imgProfil: {
    imgUrl: string;
  };
  rank: {
    level: number;
    experience: number;
    rankNow: string;
  };
  status: string;
};

export default function BarisTable({ dataUser, index }: { dataUser: dataUserType; index: number }) {
  const { data: session }: any = useSession();
  const { detailUser, setDetailUser } = useContext(GlobalState);
  const { bannedUser } = useContext(DasboardContext);
  const [editAuthor, setEditAuthor] = useState<boolean>(false);
  const { updateRole } = useContext(DasboardContext);
  const btnAuthor = useRef<HTMLButtonElement | null>(null);
  const sltAuthor = useRef<HTMLSelectElement | null>(null);
  const [newDataUser, setNewDataUser] = useState<any | null>(null);

  useEffect(() => {
    const handleClickOutSide = (e: MouseEvent) => {
      if (
        btnAuthor &&
        !btnAuthor?.current?.contains(e.target as Node) &&
        sltAuthor &&
        !sltAuthor?.current?.contains(e.target as Node)
      ) {
        setEditAuthor(false);
      }
    };

    if (editAuthor) {
      document.addEventListener("mousedown", handleClickOutSide);
    } else {
      document.removeEventListener("mousedown", handleClickOutSide);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, [editAuthor]);

  const handleChange = (event: { target: { value: string } }) => {
    const newRole = event.target.value;
    updateRole(dataUser?._id, dataUser?.email, newRole);
  };

  const [status, setStatus] = useState(dataUser?.role || "Role");

  useEffect(() => {
    setStatus(dataUser?.role || "Role");
  }, [dataUser]);

  return (
    <tr>
      <th>{index + 1}</th>
      <td>
        <div className="flex items-center gap-3">
          <Link
            aria-labelledby={`buttonRouter${dataUser?._id}`}
            className="avatar cursor-pointer"
            href={`/user/@${dataUser?.username}`}
          >
            <Picture className="size-12 border rounded-full" src={dataUser?.imgProfil?.imgUrl} />
          </Link>
          <div>
            <Link
              aria-labelledby={`buttonrouter${index}`}
              className="flex items-center gap-2 cursor-pointer"
              href={`/user/@${dataUser?.username}`}
            >
              <p className="font-bold">{dataUser?.username}</p>
              <div className="flex items-center">
                {dataUser?.badge.map((logo: string, index: number) => (
                  <Picture key={index} className="size-4" src={logo} />
                ))}
              </div>
            </Link>
            <div className="text-sm">{formatDate(dataUser?.createdAt, true)}</div>
          </div>
        </div>
      </td>
      <td>{dataUser?.email}</td>
      <td>Level {dataUser?.rank?.level}</td>
      <td>
        {dataUser?.status === "aktif" &&
        dataUser?._id !== session?.user?._id &&
        dataUser?.email !== "samuderanst@gmail.com" ? (
          <button
            className="bg-red-500 px-2 py-1 text-white rounded-lg active:bg-red-600"
            onClick={() => bannedUser(dataUser?._id, "banned")}
          >
            banned
          </button>
        ) : null}

        {dataUser?.status === "banned" &&
        dataUser?._id !== session?.user?._id &&
        dataUser?.email !== "samuderanst@gmail.com" ? (
          <button
            className="bg-blue-500 px-2 py-1 text-white rounded-lg active:bg-blue-600"
            onClick={() => bannedUser(dataUser?._id, "aktif")}
          >
            unbanned
          </button>
        ) : null}
      </td>
      <td>
        <div className="flex flex-row items-center justify-between gap-2 font-semibold">
          <div className="flex items-center">
            {dataUser?.badge.map((logo: string, index: number) => (
              <Picture key={index} className="size-4" src={logo} />
            ))}
          </div>
          <div className={`flex relative w-full justify-end pr-7`}>
            <button
              aria-labelledby={`buttoonModalTable${dataUser?._id}`}
              onClick={() => {
                const modal = document.getElementById("modal_badge") as HTMLDialogElement;
                setDetailUser(dataUser);
                modal.showModal();
              }}
            >
              <FaRegEdit size={20} />
            </button>
          </div>
        </div>
      </td>
      <td>
        <div className="flex flex-row items-center justify-between gap-2 font-semibold">
          <p>{dataUser?.role}</p>
          <div
            className={`${
              dataUser?._id === session?.user?._id || dataUser?.email === "samuderanst@gmail.com"
                ? "hidden"
                : "flex"
            } relative w-full justify-end flex pr-7`}
          >
            <button
              ref={btnAuthor}
              aria-labelledby={`buttonRegEdit${index}`}
              onClick={() => setEditAuthor(!editAuthor)}
            >
              <FaRegEdit size={20} />
            </button>
            <select
              ref={sltAuthor}
              className={`${
                editAuthor ? "flex" : "hidden"
              } select select-bordered w-[130px] dark:bg-primary-black absolute right-[50px] top-[20px]`}
              value={status}
              onChange={async (e) => {
                await handleChange(e);
                if (typeof document !== "undefined") {
                  const modal = document.getElementById("modal_badge") as HTMLDialogElement;
                  if (modal) {
                    modal.close();
                  }
                }
                setStatus(e.target.value);
              }}
            >
              <option disabled className="bg-blue-400 text-white" value="Role">
                {dataUser?.role}
              </option>
              <option value="Reguler">Reguler</option>
              <option value="Author">Author</option>
              <option value="Developer">Developer</option>
            </select>
          </div>
        </div>
      </td>
      <td>
        <button onClick={() => setNewDataUser(dataUser)}>
          <FiSend size={25} />
        </button>
      </td>
      {newDataUser && <ModalInbox dataChapter={dataUser} setNewDataChapter={setNewDataUser} />}
      <ModalBadge dataUser={detailUser} />
    </tr>
  );
}

const joditButtons = [
  "bold",
  "italic",
  "underline",
  "strikethrough",
  "ul",
  "ol",
  "outdent",
  "indent",
  "align",
  "link",
  "image",
  "font",
  "fontsize",
  "brush",
  "paragraph",
  "undo",
  "redo",
  "hr",
  "eraser",
  "fullsize",
  "cut",
  "copy",
  "paste",
  "superscript",
  "subscript",
];

const ModalInbox = ({
  dataChapter,
  setNewDataChapter,
}: {
  dataChapter: any;
  setNewDataChapter: React.Dispatch<SetStateAction<any | null>>;
}) => {
  const { loadingMsg, sendMessage } = useContext(MessageContext);
  const { data: session }: any = useSession();

  const [msgInbox, setMsgInbox] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999] md:px-[100px] px-5"
      onClick={() => setNewDataChapter(null)}
    >
      <div
        ref={containerRef}
        className="relative bg-white dark:bg-primary-dark p-5 rounded-lg shadow-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-6 rounded-full hover:bg-white text-black hover:text-red-500"
          onClick={() => setNewDataChapter(null)}
        >
          <RiCloseLine size={25} />
        </button>
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(
              {
                senderId: session?.user?._id,
                recipientId: dataChapter?._id,
                message: msgInbox,
                type: "message",
              },
              setNewDataChapter,
            );
          }}
        >
          <p className="text-base font-semibold">Username: {dataChapter.username}</p>
          <JoditText
            content={msgInbox}
            height={"50vh"}
            joditButtons={joditButtons}
            setContent={setMsgInbox}
          />
          <Button disabled={loadingMsg} label={`${dataChapter?._id}UpdateInbox`} type="submit">
            {loadingMsg ? "loading..." : "Send Message"}
          </Button>
        </form>
      </div>
    </div>
  );
};
