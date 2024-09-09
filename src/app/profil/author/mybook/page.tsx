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
    previewUrl,
    setPreviewUrl,
    loadingBook,
    myBookData,
    setMyBookData,
    msgUploadBook,
    uploadMyBook,
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
        setMyBookData({ ...myBookData, imgBooks: dataFoto });
      };
    } else {
      setMyBookData({
        ...myBookData,
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
        className="md:w-auto w-full flex md:flex-row flex-col gap-5 border p-4 rounded-lg bg-white shadow-xl"
        onSubmit={(e) => {
          e.preventDefault();
          uploadMyBook(myBookData, session?.user?._id);
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
              className="bg-red-500"
              container="float"
              name="title"
              type="text"
              value={myBookData.title}
              varLabel="float"
              variant="float"
              onChange={(e) => setMyBookData({ ...myBookData, title: e.target.value })}
            >
              Title
            </Input>
            <Input
              classDiv="w-full"
              classLabel="bg-transparent"
              className="bg-red-500"
              container="float"
              name="writer"
              type="text"
              value={myBookData.writer}
              varLabel="float"
              variant="float"
              onChange={(e) => setMyBookData({ ...myBookData, writer: e.target.value })}
            >
              Penulis
            </Input>
            <Input
              classDiv="w-full"
              classLabel="bg-transparent"
              className="bg-red-500"
              container="float"
              name="terbit"
              type="date"
              value={myBookData.terbit}
              varLabel="float"
              variant="float"
              onChange={(e) => setMyBookData({ ...myBookData, terbit: e.target.value })}
            >
              Terbit
            </Input>
            <select
              className={`flex select select-bordered w-full`}
              value={myBookData.jenis}
              onChange={(e) => {
                setMyBookData({ ...myBookData, jenis: e.target.value });
              }}
            >
              <option disabled className="bg-blue-400 text-white" value="Jenis Buku">
                Jenis Buku
              </option>
              <option value="Novel">Novel</option>
              <option value="Cerpen">Cerpen</option>
            </select>
          </div>
          <div className={`${nextInput ? "flex" : "hidden"} h-full pb-2 w-full`}>
            <textarea
              className="outline-none min-h-full w-full border rounded-lg p-2"
              placeholder="sinopsis"
              value={myBookData.sinopsis}
              onChange={(e) => setMyBookData({ ...myBookData, sinopsis: e.target.value })}
            />
          </div>
          {buttonGenre && <UploadGenre dataBook={myBookData} setDataBook={setMyBookData} />}
          <div className="w-full flex md:pt-0 pt-2">
            {nextInput ? (
              <>
                <div className="flex gap-2 w-full">
                  <Button
                    className="w-full"
                    label="buttonBackSesi"
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
                      label="buttonBackButtonGenre"
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
                      label="buttonUploadBook"
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
                    label="ButtonNextSesi"
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
