import React, { useState, useEffect, useRef, useContext } from "react";
import { FaRegEdit } from "react-icons/fa";
import { useSession } from "next-auth/react";

import Img from "./image";
import { ModalBadge } from "./modalbadge";

import { formatDate } from "@/lib/utils/parseTime";
import { DasboardContext } from "@/lib/context/dasboardcontext";
import { GlobalState } from "@/lib/context/globalstate";

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
};

export default function BarisTable({ dataUser, index }: { dataUser: dataUserType; index: number }) {
  const { data: session }: any = useSession();
  const { detailUser, setDetailUser, handleRouter } = useContext(GlobalState);
  const [editAuthor, setEditAuthor] = useState<boolean>(false);
  const { updateRole } = useContext(DasboardContext);
  const btnAuthor = useRef<HTMLButtonElement | null>(null);
  const sltAuthor = useRef<HTMLSelectElement | null>(null);

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
          <button
            aria-labelledby={`buttonRouter${dataUser?._id}`}
            className="avatar cursor-pointer"
            onClick={() => handleRouter(dataUser?.username)}
          >
            <Img className="size-12 border rounded-full" src={`${dataUser?.imgProfil?.imgUrl}`} />
          </button>
          <div>
            <button
              aria-labelledby={`buttonrouter${index}`}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => handleRouter(dataUser?.username)}
            >
              <p className="font-bold">{dataUser?.username}</p>
              <div className="flex items-center">
                {dataUser?.badge.map((logo: string, index: number) => (
                  <Img key={index} className="size-4" src={`${logo}`} />
                ))}
              </div>
            </button>
            <div className="text-sm">{formatDate(dataUser?.createdAt, true)}</div>
          </div>
        </div>
      </td>
      <td>{dataUser?.email}</td>
      <td>Level {dataUser?.rank?.level}</td>
      <td>
        <div className="flex flex-row items-center justify-between gap-2 font-semibold">
          <div className="flex items-center">
            {dataUser?.badge.map((logo: string, index: number) => (
              <Img key={index} className="size-4" src={`${logo}`} />
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
              dataUser?._id === session?.user?._id ? "hidden" : "flex"
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
              } select select-bordered w-full absolute -left-[45px] top-[20px]`}
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
      <ModalBadge dataUser={detailUser} />
    </tr>
  );
}
