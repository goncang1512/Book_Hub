/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect, useContext, SetStateAction, useRef } from "react";
import { FaRegEdit } from "react-icons/fa";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { RiCloseLine } from "react-icons/ri";

import { Button } from "../elements/button";

import JoditText from "./JoditEditor";
import Picture from "../elements/image";

import { formatDate } from "@/lib/utils/parseTime";
import { DasboardContext } from "@/lib/context/dasboardcontext";
import DOMPurify from "dompurify";

const pesanNotif = {
  pesanRilis: `
  <p>Selamat! Cerita yang kamu submit telah berhasil dirilis oleh admin dan sekarang bisa dibaca oleh pengguna lainnya di platform kami. Terima kasih atas kontribusimu dan semoga ceritamu bisa menginspirasi banyak pembaca.</p>
  <p><br></p>
  <p><br></p>
  <p>Jangan lupa untuk membagikan cerita ini dengan teman-temanmu dan terus berkontribusi dengan menulis lebih banyak bab!</p>
  <p><br></p>
  <p>Salam,&nbsp;</p>
  <p>Tim BookHub</p>
  `,
  pesanDraft: `
  <p>Terima kasih telah mengirimkan ceritamu ke platform kami. Kami menghargai usaha dan kreativitas yang telah kamu curahkan.</p>
  <p><br></p>
  <p>Namun, setelah melalui proses peninjauan, kami menyesal harus memberitahumu bahwa cerita yang kamu submit belum bisa dirilis untuk dibaca oleh pengguna lain di platform kami. Ceritamu masih berada di status draft dan bisa kamu revisi kapan saja.</p>
  <p><br></p>
  <p>Tes di Sini</p>
  <p><br></p>
  <p>Silakan periksa kembali cerita yang kamu tulis dan lakukan perbaikan yang diperlukan. Kami percaya bahwa dengan sedikit penyesuaian, ceritamu bisa segera diterima dan menginspirasi banyak pembaca.</p>
  <p><br></p>
  <p>Jika ada pertanyaan atau butuh bantuan, jangan ragu untuk menghubungi kami.</p>
  <p><br></p>
  <p>Salam,&nbsp;</p>
  <p>Tim BookHub</p>
  `,
};

interface Book {
  ISBN: string;
  createdAt: Date;
  terbit: string;
  title: string;
  writer: string;
  _id: string;
  jenis: string;
  imgBooks: {
    imgUrl: string;
    public_id: string;
  };
}

export interface Canvas {
  book: Book;
  book_id: string;
  chapter: number;
  createdAt: Date;
  judul: string;
  status: string;
  story: string;
  updatedAt: Date;
  user_id: string;
  __v: number;
  _id: string;
}

export const BarisChapter = ({ dataChapter, index }: { dataChapter: Canvas; index: number }) => {
  const [newDataChapter, setNewDataChapter] = useState<Canvas | null>(null);

  return (
    <tr>
      <th>{index + 1}</th>
      <td>
        <Link
          className="flex items-center gap-3"
          href={`/read?id=${dataChapter.book_id}&chapter=${dataChapter._id}&status=check`}
        >
          <Picture
            className="w-[50px] h-[90px] border rounded-sm shadow-xl"
            src={dataChapter.book.imgBooks.imgUrl}
          />
          <div>
            <div className="font-bold">{dataChapter.book.title}</div>
            <div className="text-sm">{dataChapter.book.writer}</div>
          </div>
        </Link>
      </td>
      <td>{dataChapter.book.jenis}</td>
      <td className="font-semibold">{dataChapter.judul}</td>
      <td>chapter {dataChapter.chapter}</td>
      <td>{formatDate(dataChapter.createdAt, true)}</td>
      <td>
        <div className="flex flex-row items-center justify-between gap-2 font-semibold">
          <p>{dataChapter.status}</p>
          <div className={`flex relative w-full justify-end pr-7`}>
            <button onClick={() => setNewDataChapter(dataChapter)}>
              <FaRegEdit size={20} />
            </button>
          </div>
        </div>
      </td>
      {newDataChapter && (
        <ModalInbox dataChapter={newDataChapter} setNewDataChapter={setNewDataChapter} />
      )}
    </tr>
  );
};

type EditStatus = {
  status: string;
  message: string;
  senderId: string;
  recipientId: string;
};

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
  dataChapter: Canvas;
  setNewDataChapter: React.Dispatch<SetStateAction<Canvas | null>>;
}) => {
  const { updateCanvas } = useContext(DasboardContext);
  const { data: session }: any = useSession();

  const [editStatus, setEditStatus] = useState<EditStatus>({
    status: dataChapter.status || "Status",
    message: "",
    senderId: session?.user?._id,
    recipientId: dataChapter.user_id,
  });

  const [msgInbox, setMsgInbox] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (dataChapter) {
      setEditStatus({
        ...editStatus,
        status: dataChapter.status || "Status",
        message: "",
        senderId: session?.user?._id,
        recipientId: dataChapter.user_id,
      });
    }
  }, [dataChapter]);

  const [editJodit, setEditJodit] = useState(false);
  useEffect(() => {
    if (editStatus.status === "Rilis") {
      setEditJodit(true);
      setMsgInbox(DOMPurify.sanitize(pesanNotif.pesanRilis));
    } else if (editStatus.status === "Draft") {
      setEditJodit(true);
      setMsgInbox(DOMPurify.sanitize(pesanNotif.pesanDraft));
    } else if (editStatus.status === "Submitted") {
      setEditJodit(false);
      setMsgInbox("");
    }
  }, [editStatus.status, editJodit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await updateCanvas(
        dataChapter._id,
        {
          ...editStatus,
          message: msgInbox,
        },
        setNewDataChapter,
      );
    } catch (err) {
      setError("Failed to update canvas. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[99999] md:px-[100px] px-5"
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
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <p className="text-base font-semibold">{dataChapter.judul}</p>
          <select
            className="flex select dark:bg-primary-black select-bordered w-full"
            value={editStatus.status}
            onChange={(e) => setEditStatus({ ...editStatus, status: e.target.value })}
          >
            <option disabled className="bg-blue-400 text-white" value="Role">
              {dataChapter.status}
            </option>
            <option value="Submitted">Submitted</option>
            <option value="Rilis">Rilis</option>
            <option value="Draft">Draft</option>
          </select>
          <JoditText
            content={msgInbox}
            edit={editJodit}
            height={"50vh"}
            joditButtons={joditButtons}
            setContent={setMsgInbox}
          />
          <Button
            disabled={loading}
            label={`${dataChapter?._id}UpdateInbox`}
            size="medium"
            type="submit"
            variant="primary"
          >
            {loading ? "Updating..." : "Update Status"}
          </Button>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      </div>
    </div>
  );
};
