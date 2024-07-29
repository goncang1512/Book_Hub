"use client";
import * as React from "react";
import { useSession } from "next-auth/react";
import { useContext, useEffect, useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { FaPaintBrush } from "react-icons/fa";

import { Button } from "@/components/elements/button";
import { UserContext } from "@/lib/context/usercontext";
import styles from "@/lib/style.module.css";
import { Input } from "@/components/elements/input";

export default function EditProfil() {
  const { setUpdateData, msgUpdateData } = useContext(UserContext);
  const { data: session }: any = useSession();

  useEffect(() => {
    setUpdateData({
      username: session?.user?.username || "",
      number: session?.user?.number || "",
      email: session?.user?.email || "",
      alamat: session?.user?.alamat?.detail || "",
      kecamatan: session?.user?.alamat?.kecamatan || "",
      kabupaten: session?.user?.alamat?.kabupaten || "",
      provinsi: session?.user?.alamat?.provinsi || "",
    });
  }, [session]);

  return (
    <main className="p-5 flex flex-col gap-5">
      <div className="w-full flex flex-col gap-5 md:px-[16%] px-0 md:p-5 p-0">
        <TopEditFotoProfil />
        <p className="text-red-500 italic">{msgUpdateData}</p>
        <UpdateData />
        <UpdatePassword />
      </div>
    </main>
  );
}

function UpdateData() {
  const { updateUsername, updateData, setUpdateData, loadingUpdateData } = useContext(UserContext);
  const { data: session }: any = useSession();

  return (
    <form
      className="flex flex-col gap-5 items-center w-full"
      onSubmit={(e) => {
        e.preventDefault();
        updateUsername(session?.user?._id, updateData);
      }}
    >
      <div className="flex gap-5 md:flex-row flex-col w-full items-center justify-between">
        <Input
          classDiv="w-full"
          container="labelFloat"
          name="username"
          required={true}
          type="text"
          value={updateData.username}
          varLabel="labelFloat"
          variant="labelFloat"
          onChange={(e) => setUpdateData({ ...updateData, username: e.target.value })}
        >
          Username
        </Input>
        <Input
          classDiv="w-full"
          container="labelFloat"
          name="number"
          required={false}
          type="number"
          value={updateData.number}
          varLabel="labelFloat"
          variant="labelFloat"
          onChange={(e) => setUpdateData({ ...updateData, number: e.target.value })}
        >
          Contact Number
        </Input>
        <Input
          classDiv="w-full"
          container="labelFloat"
          name="email"
          required={true}
          type="text"
          value={updateData.email}
          varLabel="labelFloat"
          variant="labelFloat"
          onChange={(e) => setUpdateData({ ...updateData, email: e.target.value })}
        >
          E-mail
        </Input>
      </div>
      <div className="flex flex-col gap-5 w-full">
        <Input
          container="labelFloat"
          name="alamat"
          required={false}
          type="text"
          value={updateData.alamat}
          varLabel="labelFloat"
          variant="labelFloat"
          onChange={(e) => setUpdateData({ ...updateData, alamat: e.target.value })}
        >
          Alamat
        </Input>
      </div>
      <div className="w-full flex justify-start">
        <Button className="w-96" disabled={loadingUpdateData} type="submit" variant="login">
          {loadingUpdateData ? "loading..." : "Update Data User"}
        </Button>
      </div>
    </form>
  );
}

const UpdateFotoProfil = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const {
    loadingUpdateFoto,
    updateFoto,
    setUpdateFoto,
    newFotoProfil,
    deleteFoto,
    loadingDelete,
    messageNewFoto,
  } = useContext(UserContext);
  const { data: session }: any = useSession();

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
          img: reader.result as string,
        };
        setPreviewUrl(reader.result as string);
        setUpdateFoto(dataFoto);
      };
    } else {
      setUpdateFoto(null);
    }
  };

  useEffect(() => {
    setPreviewUrl(session?.user?.imgProfil?.imgUrl);
  }, [session?.user?.imgProfil?.imgUrl]);

  return (
    <form
      className="flex md:flex-row flex-col gap-5 items-center"
      onSubmit={async (e) => {
        e.preventDefault();
        await newFotoProfil(session?.user?._id, updateFoto);
      }}
    >
      <div className="flex relative rounded-full size-72">
        <div className={`${styles.imgUpload} size-72 rounded-full`}>
          <img alt="" className="border size-72 rounded-full object-cover" src={`${previewUrl}`} />
        </div>
        <label
          className={`${styles.labelUpload} hidden absolute left-0 top-0 text-white text-base  flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed mx-auto font-[sans-serif] size-72 hover:bg-black hover:bg-opacity-50 z-10 rounded-full`}
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
        </label>
      </div>
      <div className="flex flex-col gap-3 items-center">
        <h1 className="text-base text-red-500">{messageNewFoto}</h1>

        <Button
          className="w-max px-3 rounded-lg font-semibold"
          disabled={loadingUpdateFoto}
          type="submit"
          variant="primary"
        >
          {loadingUpdateFoto ? "loading..." : "Update foto profil"}
        </Button>
        <Button
          className="w-max px-3 rounded-lg font-semibold"
          disabled={loadingDelete}
          type="button"
          variant="danger"
          onClick={() => deleteFoto(session?.user?._id, session?.user?.imgProfil.public_id)}
        >
          {loadingDelete ? "loading..." : "Delete foto profil"}
        </Button>
      </div>
    </form>
  );
};

const TopEditFotoProfil = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { data: session }: any = useSession();

  useEffect(() => {
    setPreviewUrl(session?.user?.imgProfil?.imgUrl);
  }, [session?.user?.imgProfil?.imgUrl]);
  return (
    <div className="flex gap-5 items-center">
      <div className="flex relative">
        <div className={``}>
          <img alt="" className="border size-44 rounded-full object-cover" src={`${previewUrl}`} />
        </div>
        <button
          className={`absolute bottom-5 right-2 bg-blue-500 p-1 rounded-full active:scale-110`}
          type="button"
          onClick={() => {
            const modal: any = document.getElementById("modal_edit_foto");
            modal?.showModal();
          }}
        >
          <FaPaintBrush size={17} />
        </button>
      </div>
      <div className="flex flex-col items-start">
        <h1 className="text-base font-semibold">{session?.user?.username}</h1>
        <h1 className="text-sm text-gray-500">{session?.user?.email}</h1>
      </div>
      <UpdateFotoProfilDialog />
    </div>
  );
};

const UpdateFotoProfilDialog = () => {
  return (
    <dialog className="modal" id="modal_edit_foto">
      <div className="modal-box w-full">
        <div>
          <UpdateFotoProfil />
        </div>
      </div>
      <form className="modal-backdrop" method="dialog">
        <button>close</button>
      </form>
    </dialog>
  );
};

const UpdatePassword = () => {
  const { data: session }: any = useSession();
  const {
    nextPassword,
    loadingPassword,
    msgPassword,
    password,
    setPassword,
    kirimPassword,
    updatePassword,
  } = useContext(UserContext);

  return (
    <div className="w-full">
      <h1 className="font-semibold pb-2">Ganti Password</h1>
      <p className="text-red-500 italic pb-4">{msgPassword}</p>
      {nextPassword ? (
        <form
          className="flex md:flex-row flex-col items-center gap-3 w-full"
          onSubmit={(e) => {
            e.preventDefault();
            updatePassword(session?.user?._id, password.newPassword, password.confNewPassword);
          }}
        >
          <Input
            classDiv="md:w-96 w-full"
            container="labelFloat"
            name="newpassword"
            type="password"
            value={password.newPassword}
            varLabel="labelFloat"
            variant="labelFloat"
            onChange={(e) => setPassword({ ...password, newPassword: e.target.value })}
          >
            Password Baru
          </Input>
          <Input
            classDiv="md:w-96 w-full"
            container="labelFloat"
            name="confnewpassword"
            type="password"
            value={password.confNewPassword}
            varLabel="labelFloat"
            variant="labelFloat"
            onChange={(e) => setPassword({ ...password, confNewPassword: e.target.value })}
          >
            Konfirmasi Password Baru
          </Input>
          <Button type="submit" variant="primary">
            {loadingPassword ? "Loading" : "Update"}
          </Button>
        </form>
      ) : (
        <form
          className="flex items-center gap-3 w-full"
          onSubmit={(e) => {
            e.preventDefault();
            kirimPassword(session?.user?.email, password.oldPassword);
          }}
        >
          <Input
            classDiv="md:w-96 w-full"
            container="labelFloat"
            name="oldpassword"
            type="password"
            value={password.oldPassword}
            varLabel="labelFloat"
            variant="labelFloat"
            onChange={(e) => setPassword({ ...password, oldPassword: e.target.value })}
          >
            Password Lama
          </Input>
          <Button type="submit" variant="primary">
            {loadingPassword ? "Loading" : "Kirim"}
          </Button>
        </form>
      )}
    </div>
  );
};
