"use client";
import { useSession } from "next-auth/react";
import React, { useContext, useEffect, useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";

import { Button } from "@/components/elements/button";
import { Input } from "@/components/elements/input";
import { UserContext } from "@/lib/context/usercontext";
import styles from "@/lib/style.module.css";
import { AuthContext } from "@/lib/context/authcontext";

export default function EndPoint({ params }: { params: { slug: string[] } }) {
  return (
    <div>
      {params.slug[0] === "password" && (
        <div className="flex items-center justify-center h-screen w-full pt-10">
          <UpdatePassword />
        </div>
      )}

      {params.slug[0] === "email" && <div />}

      {params.slug[0] === "fotoprofil" && (
        <div className="flex items-center justify-center h-screen w-full pt-10">
          <UpdateFotoProfil />
        </div>
      )}

      {params.slug[0] === "biografi" && (
        <div className="flex items-center justify-center h-screen w-full md:px-[16%] px-0">
          <UpdateData />
        </div>
      )}
    </div>
  );
}

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

  const {
    trueCode,
    sendNewEmail,
    updateEmail,
    msgUpdateData,
    loadingEmail,
    newEmail,
    setNewEmail,
    codeOtp,
    setCodeOtp,
  } = useContext(AuthContext);

  useEffect(() => {
    setNewEmail(session?.user?.email);
  }, [session?.user?.email]);

  return (
    <div className="w-max flex flex-col gap-4 dark:bg-primary-black p-5 rounded-lg">
      <div>
        <h1 className="font-semibold pb-2">Ganti Password</h1>
        <p className="text-red-500 italic pb-4">{msgPassword}</p>
        {nextPassword ? (
          <form
            className="flex flex-col items-center gap-5 w-full"
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
            <Button label="buttonUpdatePassword" size="medium" type="submit" variant="primary">
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
            <Button label="buttonUpdatePasswordKirim" size="medium" type="submit" variant="primary">
              {loadingPassword ? "Loading" : "Kirim"}
            </Button>
          </form>
        )}
      </div>

      {/* Ganti Password */}
      <div>
        <h1 className="font-semibold">Ganti Email</h1>
        {trueCode ? (
          <form
            className="flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              updateEmail(codeOtp, session?.user?._id);
            }}
          >
            <h1>Kode OTP</h1>
            <p className="italic text-red-500">{msgUpdateData}</p>
            <div className="flex gap-3 items-center">
              <Input
                classDiv="md:w-96 w-full"
                container="labelFloat"
                name="kodeotp"
                type="text"
                value={codeOtp}
                varLabel="labelFloat"
                variant="labelFloat"
                onChange={(e) => setCodeOtp(e.target.value)}
              >
                Kode OTP
              </Input>
              <Button label="buttonKodeOtp" type="submit">
                {loadingEmail ? "Loading..." : "Kode OTP"}
              </Button>
            </div>
          </form>
        ) : (
          <form
            className="flex flex-col gap-2 pt-2"
            onSubmit={(e) => {
              e.preventDefault();
              sendNewEmail(session?.user?.email, newEmail, session?.user?._id);
            }}
          >
            <p className="text-sm italic">
              Masukkan email yang baru, akan di kirim kode OTP ke email baru kamu.
            </p>
            <p className="italic text-red-500">{msgUpdateData}</p>
            <div className="flex gap-3 items-center">
              <Input
                classDiv="md:w-96 w-full"
                container="labelFloat"
                name="email"
                type="text"
                value={newEmail}
                varLabel="labelFloat"
                variant="labelFloat"
                onChange={(e) => setNewEmail(e.target.value)}
              >
                New Email
              </Input>
              <Button
                disabled={newEmail === session?.user?.email}
                label="buttonNewEmail"
                type="submit"
              >
                {loadingEmail ? "Loading..." : "New Email"}{" "}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

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
      <div className="flex relative rounded-full size-56">
        <div className={`${styles.imgUpload} size-56 rounded-full`}>
          <img alt="" className="border size-56 rounded-full object-cover" src={`${previewUrl}`} />
        </div>
        <label
          className={`${styles.labelUpload} hidden absolute left-0 top-0 text-white text-base  flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed mx-auto font-[sans-serif] size-56 hover:bg-black hover:bg-opacity-50 z-10 rounded-full`}
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
          label="buttonUpdateFotoProfil"
          size="medium"
          type="submit"
          variant="primary"
        >
          {loadingUpdateFoto ? "loading..." : "Update foto profil"}
        </Button>
        <Button
          className="w-max px-3 rounded-lg font-semibold"
          disabled={loadingDelete}
          label="buttonDeleteFotoProfil"
          size="medium"
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

function UpdateData() {
  const { updateUsername, updateData, msgUpdateData, setUpdateData, loadingUpdateData } =
    useContext(UserContext);
  const { data: session }: any = useSession();

  useEffect(() => {
    setUpdateData({
      username: session?.user?.username || "",
      number: session?.user?.number || "",
      email: session?.user?.email || "",
      alamat: session?.user?.alamat || "",
    });
  }, [session]);

  return (
    <form
      className="flex flex-col gap-5 items-center w-full max-md:px-3"
      onSubmit={(e) => {
        e.preventDefault();
        updateUsername(session?.user?._id, updateData);
      }}
    >
      <p className="text-red-500 italic">{msgUpdateData}</p>
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
          readonly={true}
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
        <Button
          className="w-96"
          disabled={loadingUpdateData}
          label="buttonUpdateDatauser"
          size="medium"
          type="submit"
          variant="login"
        >
          {loadingUpdateData ? "loading..." : "Update Data User"}
        </Button>
      </div>
    </form>
  );
}
