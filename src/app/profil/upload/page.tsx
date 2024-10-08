"use client";
import * as React from "react";
import { useState, useContext } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { useSession } from "next-auth/react";

import styles from "@/lib/style.module.css";
import { Input } from "@/components/elements/input";
import { Button } from "@/components/elements/button";
import { BookContext } from "@/lib/context/bookcontext";
import { UploadGenre } from "@/components/layouts/uploadbook";

export default function UploadBooks() {
  const [nextInput, setNextInput] = useState<boolean>(false);
  const [buttonGenre, setButtonGenre] = useState<boolean>(false);
  const { data: session }: any = useSession();
  const {
    uploadBook,
    previewUrl,
    setPreviewUrl,
    loadingBook,
    bookData,
    setBookData,
    msgUploadBook,
  } = useContext(BookContext);

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
        setPreviewUrl(reader.result as string);
        setBookData({ ...bookData, imgBooks: dataFoto });
      };
    } else {
      setBookData({
        ...bookData,
        imgBooks: {
          size: 0,
          type: "",
          img: "",
        },
      });
    }
  };

  return (
    <main className="w-full flex flex-col gap-3 items-center justify-center h-screen md:px-0 px-3">
      <p className="text-red-500 italic">{msgUploadBook}</p>
      <form
        className="md:w-auto w-full flex md:flex-row flex-col gap-5 border p-4 rounded-lg bg-white dark:bg-primary-black shadow-xl"
        onSubmit={(e) => {
          e.preventDefault();
          uploadBook(bookData, session?.user?._id, "Review");
        }}
      >
        <div className="flex items-center justify-center">
          <div className="flex relative w-[206px] h-[305px] rounded-lg">
            <div className={`${styles.imgUpload} rounded-lg h-max`}>
              <img
                alt=""
                className={`${
                  previewUrl ? "flex" : "hidden"
                } border w-[206px] h-[305px] rounded-lg object-cover`}
                src={`${previewUrl}`}
              />
            </div>
            <label
              className={`${styles.labelUpload} ${
                !previewUrl
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
              classLabel="bg-transparent"
              container="float"
              name="title"
              type="text"
              value={bookData.title}
              varLabel="float"
              variant="float"
              onChange={(e) => setBookData({ ...bookData, title: e.target.value })}
            >
              Title
            </Input>
            <Input
              classDiv="w-full"
              classLabel="bg-transparent"
              container="float"
              name="penulis"
              type="text"
              value={bookData.writer}
              varLabel="float"
              variant="float"
              onChange={(e) => setBookData({ ...bookData, writer: e.target.value })}
            >
              Penulis
            </Input>
            <Input
              classDiv="w-full"
              classLabel="bg-transparent text-white"
              container="float"
              name="terbit"
              type="date"
              value={bookData.terbit}
              varLabel="float"
              variant="float"
              onChange={(e) => setBookData({ ...bookData, terbit: e.target.value })}
            >
              Terbit
            </Input>
            <Input
              classDiv="w-full"
              container="float"
              name="isbn"
              type="number"
              value={bookData.ISBN || ""}
              varLabel="float"
              variant="float"
              onChange={(e) => setBookData({ ...bookData, ISBN: e.target.value })}
            >
              ISBN
            </Input>
          </div>
          <div className={`${nextInput ? "flex" : "hidden"} h-full pb-2 w-full`}>
            <textarea
              className="outline-none min-h-full w-full bg-transparent border rounded-lg p-2"
              placeholder="sinopsis"
              value={bookData.sinopsis}
              onChange={(e) => setBookData({ ...bookData, sinopsis: e.target.value })}
            />
          </div>
          {buttonGenre && <UploadGenre dataBook={bookData} setDataBook={setBookData} />}
          <div className="w-full flex md:pt-0 pt-2">
            {nextInput ? (
              <>
                <div className="flex gap-2 w-full">
                  <Button
                    className="w-full"
                    label="buttonback"
                    size="medium"
                    type="button"
                    variant="primary"
                    onClick={() => setNextInput(false)}
                  >
                    Back
                  </Button>
                  <button
                    aria-labelledby="buttonNextSesi"
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
                      label="buttonBackGenre"
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
                      disabled={loadingBook}
                      label="ButtonUPdloadBook"
                      type="submit"
                      variant="primary"
                    >
                      {loadingBook ? (
                        <span className="loading loading-dots loading-md" />
                      ) : (
                        "Upload"
                      )}
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="w-full"
                    label="buttonNextUploadBook"
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
