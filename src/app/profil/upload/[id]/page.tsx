"use client";
import * as React from "react";
import { useState, useContext, useEffect } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { format } from "date-fns";

import styles from "@/lib/style.module.css";
import { Input } from "@/components/elements/input";
import { Button } from "@/components/elements/button";
import { BookContext } from "@/lib/context/bookcontext";
import { useBooks } from "@/lib/utils/useSwr";
import { UploadGenre } from "@/components/layouts/uploadbook";

export default function EditBook({ params }: { params: { id: string } }) {
  const [nextInput, setNextInput] = useState<boolean>(false);
  const [buttonGenre, setButtonGenre] = useState<boolean>(false);

  const { detailBook, detailBookLoading } = useBooks.detailBook(params.id);

  const { previewUpdate, setPreviewUpdate, loadingUpdateBook, editBook, setEditBook, updatedBook } =
    useContext(BookContext);

  const transformFile = (e: any) => {
    const file = e.target.files[0];

    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const dataFoto = {
          size: file.size,
          type: file.type,
          img: reader.result as string,
        };
        setPreviewUpdate(reader.result as string);
        setEditBook({ ...editBook, imgBooks: dataFoto });
      };
    } else {
      setEditBook({
        ...editBook,
        imgBooks: {
          size: 0,
          type: "",
          img: "",
        },
      });
    }
  };

  useEffect(() => {
    if (detailBook) {
      setEditBook({
        ...editBook,
        title: detailBook?.title || "",
        writer: detailBook?.writer || "",
        terbit: detailBook?.terbit ? format(new Date(detailBook.terbit), "yyyy-MM-dd") : "",
        sinopsis: detailBook?.sinopsis || "",
        ISBN: detailBook?.ISBN || "",
        genre: detailBook?.genre || [],
      });
      setPreviewUpdate(detailBook?.imgBooks?.imgUrl);
    }
  }, [detailBook]);

  if (detailBookLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <span className="loading loading-bars loading-lg" />
      </div>
    );
  }

  return (
    <main className="w-full flex items-center justify-center h-screen md:px-0 px-3">
      <form
        className="md:w-auto w-full flex md:flex-row flex-col gap-5 border p-4 rounded-lg bg-white dark:bg-primary-black shadow-xl"
        onSubmit={(e) => {
          e.preventDefault();
          updatedBook(editBook, params.id);
        }}
      >
        <div className="flex items-center justify-center">
          <div className="flex relative w-[206px] h-[305px] rounded-lg">
            <div className={`${styles.imgUpload} rounded-lg h-max`}>
              <img
                alt=""
                className={`${
                  previewUpdate ? "flex" : "hidden"
                } border w-[206px] h-[305px] rounded-lg object-cover`}
                src={`${previewUpdate}`}
              />
            </div>
            <label
              className={`${styles.labelUpload} ${
                !previewUpdate
                  ? "flex text-black"
                  : "hidden text-white hover:bg-black hover:bg-opacity-50"
              } absolute left-0 top-0  text-base  flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed mx-auto font-[sans-serif] w-[206px] h-[305px]  z-10 rounded-lg`}
            >
              <IoCloudUploadOutline size={25} />
              Upload file
              <input className="hidden" id="uploadFile1" type="file" onChange={transformFile} />
              <p className="mt-2 text-xs text-gray-400">PNG, JPG, JPEG</p>
              <p className="mt-2 text-xs text-gray-400 text-center">
                Direkomendasikan dengan <br /> 216 X 315 px
              </p>
            </label>
          </div>
        </div>

        {/* INPUT DATA CONTENT BOOK */}
        <div className="flex flex-col justify-between">
          <div className={`${nextInput || buttonGenre ? "hidden" : "flex"} flex-col gap-4`}>
            <Input
              classDiv="w-full"
              className="bg-red-500"
              container="float"
              name="title"
              type="text"
              value={editBook.title}
              varLabel="float"
              variant="float"
              onChange={(e) => setEditBook({ ...editBook, title: e.target.value })}
            >
              Title
            </Input>
            <Input
              classDiv="w-full"
              className="bg-red-500"
              container="float"
              name="penulis"
              type="text"
              value={editBook.writer}
              varLabel="float"
              variant="float"
              onChange={(e) => setEditBook({ ...editBook, writer: e.target.value })}
            >
              Penulis
            </Input>
            <Input
              classDiv="w-full"
              className="bg-red-500"
              container="float"
              name="terbit"
              type="date"
              value={editBook.terbit}
              varLabel="float"
              variant="float"
              onChange={(e) => setEditBook({ ...editBook, terbit: e.target.value })}
            >
              Terbit
            </Input>
            <Input
              classDiv="w-full"
              className="bg-red-500"
              container="float"
              name="isbn"
              type="number"
              value={editBook.ISBN}
              varLabel="float"
              variant="float"
              onChange={(e) => setEditBook({ ...editBook, ISBN: e.target.value })}
            >
              ISBN
            </Input>
          </div>
          <div className={`${nextInput ? "flex" : "hidden"} h-full pb-2 w-full`}>
            <textarea
              className="outline-none min-h-full bg-transparent border rounded-lg p-2 w-full"
              placeholder="sinopsis"
              value={editBook.sinopsis}
              onChange={(e) => setEditBook({ ...editBook, sinopsis: e.target.value })}
            />
          </div>
          {buttonGenre && <UploadGenre dataBook={editBook} setDataBook={setEditBook} />}
          <div className="w-full flex md:pt-0 pt-2">
            {nextInput ? (
              <>
                <div className="flex gap-2 w-full">
                  <Button
                    className="w-full"
                    label="backsesiBook"
                    size="medium"
                    type="button"
                    variant="primary"
                    onClick={() => setNextInput(false)}
                  >
                    Back
                  </Button>
                  <button
                    className="bg-[#0077B6] text-white border-transparent md:hover:bg-[#03045E] max-[640px]:active:bg-[#03045E] rounded-lg w-full"
                    type="button"
                    onClick={() => {
                      setButtonGenre(true);
                      setNextInput(false);
                    }}
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <>
                {buttonGenre ? (
                  <div className="flex gap-3 w-full">
                    <Button
                      className="w-full"
                      label="butttonBackGenre"
                      size="medium"
                      type="button"
                      variant="primary"
                      onClick={() => {
                        setNextInput(true);
                        setButtonGenre(false);
                      }}
                    >
                      Back
                    </Button>
                    <Button
                      className="w-full flex items-center justify-center"
                      disabled={loadingUpdateBook}
                      label="buttonEditBook"
                      size="medium"
                      type="submit"
                      variant="primary"
                    >
                      {loadingUpdateBook ? (
                        <span className="loading loading-dots loading-md" />
                      ) : (
                        "Edit"
                      )}
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="w-full"
                    label="buttonNextBook"
                    size="medium"
                    type="button"
                    variant="primary"
                    onClick={() => {
                      setNextInput(true);
                      setButtonGenre(false);
                    }}
                  >
                    Next
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </form>
    </main>
  );
}
