/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import * as React from "react";
import { useContext, useEffect, useRef, useState } from "react";
import { CiCamera } from "react-icons/ci";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

import Picture from "../../elements/image";

import DropDown from "../hovercard";

import { GlobalState } from "@/lib/context/globalstate";
import styles from "@/lib/style.module.css";
import { UserContext } from "@/lib/context/usercontext";
import { UserType } from "@/lib/utils/types/DataTypes.type";
import { RiCloseLine } from "react-icons/ri";
import { IoCloudUploadOutline } from "react-icons/io5";
import { Button } from "../../elements/button";

export function HeaderProfil({ userData }: { userData: UserType }) {
  const { data: session }: any = useSession();
  const { seeProfilComponent, setSeeProfilComponent } = useContext(GlobalState);
  const { deleteAccount, updateBackground, loadingUpdateFoto } = useContext(UserContext);
  const { seeAbout, seeFriends, seeProduct } = seeProfilComponent;
  const [btnEditCover, setBtnEditCover] = useState<{
    username: string;
    _id: string;
    urlLatar: string;
  } | null>(null);

  const buttonStyle = `${
    seeAbout && "after:w-[48px] after:-translate-x-[120px]"
  } ${seeFriends && "after:w-[58px] after:-translate-x-[56px]"} ${seeProduct && "after:w-[47px]"}`;

  const [previewLatar, setPreviewLatar] = useState<any>();
  const [dataLatar, setDataLatar] = useState<{ size: number; type: string; latar: string } | null>(
    null,
  );
  const transformFile = (e: any) => {
    const file = e.target.files[0];

    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const dataFoto = {
          oldId: session.user.imgProfil.public_id,
          size: file.size,
          type: file.type,
          latar: reader.result as string,
        };
        setPreviewLatar(reader.result as string);
        setDataLatar(dataFoto);
      };
    } else {
      setDataLatar(null);
    }
  };

  useEffect(() => {
    if (btnEditCover?.urlLatar) {
      setPreviewLatar(btnEditCover?.urlLatar);
    }
  }, [btnEditCover?.urlLatar]);

  return (
    <div className="flex flex-col items-center w-full relative z-[20]">
      {/* width=800 height=300 */}
      <div
        className="h-[40vh] w-full bg-cover object-cover bg-center bg-blend-multiply rounded-t-lg"
        style={{
          backgroundImage: `url('${userData?.profileGround?.urlLatar ? userData?.profileGround?.urlLatar : "/new-cover-profil.png"}')`,
        }}
      />
      <div className="h-16 white border shadow-lg w-full rounded-b-lg bg-white" />
      <div className="absolute left-0 pl-5 md:bottom-[0.7rem] bottom-[1rem] flex items-center gap-5 w-full">
        <div className="md:size-28 size-20 bg-white rounded-full">
          <Picture
            className="md:size-28 size-20 rounded-full border"
            src={userData?.imgProfil?.imgUrl}
          />
        </div>

        <div className="flex flex-col gap-11 w-full relative">
          <div className="flex w-full items-center justify-between absolute md:pr-5 pr-2 md:bottom-1 bottom-3">
            <div className="bg-white border shadow-lg px-2 rounded-lg py-1 flex items-center gap-2">
              <h1 className="font-bold text-black md:text-base text-sm">{userData?.username}</h1>
              <div className="flex items-center">
                {userData?.badge?.map((logo: string, index: number) => (
                  <Picture key={index} className="size-4" src={logo} />
                ))}
              </div>
            </div>
            {session?.user?._id === userData?._id && (
              <Button
                className="flex items-center gap-1 p-2 rounded-lg text-white bg-black/45 hover:bg-black/70 md:text-sm text-xs"
                label={`buttonEditCover-${userData?._id}`}
                onClick={() => {
                  setBtnEditCover({
                    username: userData?.username,
                    _id: userData?._id,
                    urlLatar: userData?.profileGround?.urlLatar,
                  });
                }}
              >
                <CiCamera size={20} />
                <span className="md:flex hidden">Edit Cover</span>
              </Button>
            )}
          </div>

          <div className="flex items-center justify-between pr-5 absolute md:top-[1.29rem] top-[0.7rem] w-full">
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
                  <Link
                    aria-label={`buttonSetting`}
                    className="active:text-gray-400"
                    href={"/setting"}
                  >
                    Setting
                  </Link>
                  <Link
                    aria-label="button-upload"
                    className="active:text-gray-400"
                    href={"/profil/upload"}
                  >
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

      <ModalInbox dataModal={btnEditCover} setDataModal={setBtnEditCover}>
        <p>{userData?.username}</p>
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            updateBackground(
              session?.user?._id,
              dataLatar,
              setDataLatar,
              setPreviewLatar,
              setBtnEditCover,
            );
          }}
        >
          <div className="relative group">
            <div>
              <img
                alt="Cover profile"
                className="w-[800px] h-[300px] object-cover border rounded-lg"
                src={`${previewLatar}`}
              />
            </div>
            <label
              className={`group-hover:flex hidden absolute left-0 top-0 text-white text-base  flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed mx-auto font-[sans-serif] w-full h-[300px] hover:bg-black hover:bg-opacity-50 z-10 rounded-lg`}
            >
              <IoCloudUploadOutline size={25} />
              Upload file
              <input
                className="hidden"
                id="uploadFile1"
                name="uploadFile1"
                type="file"
                onChange={transformFile}
              />
              <p className="mt-2 text-xs text-gray-400">PNG, JPG, JPEG</p>
              <p className="mt-2 text-xs text-gray-300">Recomend 800px x 300px</p>
            </label>
          </div>
          <Button
            label="buttonCover"
            name="updateCover"
            size="medium"
            type="submit"
            variant="primary"
          >
            {loadingUpdateFoto ? "loading..." : "Update cover"}
          </Button>
        </form>
      </ModalInbox>
    </div>
  );
}

const ModalInbox = ({
  dataModal,
  setDataModal,
  children,
}: {
  dataModal: any;
  setDataModal: React.Dispatch<React.SetStateAction<any | null>>;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const modal = document.getElementById("modal_inbox") as HTMLDialogElement;
    if (dataModal) {
      setDataModal(dataModal);
      modal?.showModal();
    } else {
      setDataModal(null);
      modal?.close();
    }
  }, [dataModal]);

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <dialog className="modal" id="modal_inbox" onClick={() => setDataModal(null)}>
      <div ref={containerRef} className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button
          aria-label="button-closeModalInbox"
          className="absolute top-2 right-6 rounded-full hover:bg-white text-black hover:text-red-500"
          onClick={() => setDataModal(null)}
        >
          <RiCloseLine size={25} />
        </button>
        <div className="">{children}</div>
      </div>
    </dialog>
  );
};
