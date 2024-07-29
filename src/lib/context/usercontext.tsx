import * as React from "react";
import { createContext, useState } from "react";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";
import { useSession, signOut } from "next-auth/react";

import instance from "../utils/fetch";

interface RegisterType {
  username: string;
  email: string;
  password: string;
  confpassword: string;
  codeOtp: string;
  id_register: string;
}

export interface UpdateType {
  username: string;
  number: string;
  email: string;
  alamat: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
}

type UpdateFoto = {
  oldId: string;
  size: number;
  type: string;
  img: string;
};

interface UserContextType {
  loadingRegister: boolean;
  messageRegister: string;
  dataRegister: RegisterType;
  setDataRegister: React.Dispatch<React.SetStateAction<RegisterType>>;
  registerUser: (body: RegisterType) => void;
  updateUsername: (id: string, body: UpdateType) => void;
  updateData: UpdateType;
  setUpdateData: React.Dispatch<React.SetStateAction<UpdateType>>;
  updateFoto: UpdateFoto | null;
  setUpdateFoto: React.Dispatch<React.SetStateAction<UpdateFoto | null>>;
  loadingUpdateFoto: boolean;
  setLoadingUpdateFoto: React.Dispatch<React.SetStateAction<boolean>>;
  newFotoProfil: (id: string, body: any) => void;
  deleteFoto: (id: string, idFoto: string) => void;
  loadingDelete: boolean;
  setLoadingDelete: React.Dispatch<React.SetStateAction<boolean>>;
  loadingUpdateData: boolean;
  messageNewFoto: string;
  deleteAccount: (id: string) => void;
  setMessageRegister: any;
  msgUpdateData: string;
  nextPassword: boolean;
  loadingPassword: boolean;
  msgPassword: string;
  password: {
    oldPassword: string;
    newPassword: string;
    confNewPassword: string;
  };
  setPassword: React.Dispatch<
    React.SetStateAction<{
      oldPassword: string;
      newPassword: string;
      confNewPassword: string;
    }>
  >;
  kirimPassword: (email: string, oldPassword: string) => void;
  updatePassword: (id: string, newPassword: string, confNewPassword: string) => void;
  patchBadge: (id_user: string, badge: string[]) => void;
  ldlPatchBadge: boolean;
}

export const UserContext = createContext<UserContextType>({} as UserContextType);

export default function UserContextProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { update: updateUser, data: session }: any = useSession();
  const [updateFoto, setUpdateFoto] = useState<UpdateFoto | null>(null);
  const [loadingUpdateData, setLoadingUpdateData] = useState<boolean>(false);
  const [loadingUpdateFoto, setLoadingUpdateFoto] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
  const [loadingRegister, setLoadingRegister] = useState<boolean>(false);
  const [messageRegister, setMessageRegister] = useState<string>("");
  const [msgUpdateData, setMsgUpdateData] = useState<string>("");
  const [messageNewFoto, setMessageNewFoto] = useState<string>("");
  const [dataRegister, setDataRegister] = useState<RegisterType>({
    username: "",
    email: "",
    password: "",
    confpassword: "",
    id_register: "",
    codeOtp: "",
  });

  const [updateData, setUpdateData] = useState<UpdateType>({
    username: "",
    number: "",
    email: "",
    alamat: "",
    kecamatan: "",
    kabupaten: "",
    provinsi: "",
  });

  const registerUser = async (body: RegisterType) => {
    try {
      setLoadingRegister(true);
      const res = await instance.post("/api/user", body);
      if (res.data.result) {
        setDataRegister((prev: any) => ({
          ...prev,
          username: "",
          email: "",
          password: "",
          confpassword: "",
          id_register: "",
          codeOtp: "",
        }));

        await router.push("/login");
        setLoadingRegister(false);
      }
    } catch (error: any) {
      setLoadingRegister(false);
      if (error.response) {
        setMessageRegister(error.response.data.message);
        setTimeout(() => {
          setMessageRegister("");
        }, 3000);
      } else {
        console.log(error);
      }
    }
  };

  const updateUsername = async (id: string, body: any) => {
    try {
      setLoadingUpdateData(true);
      const res = await instance.patch(`/api/user/update/${id}`, body);
      if (res.data.status) {
        await updateUser({
          status: "updateData",
          alamat: res.data.result.alamat,
          username: res.data.result.username,
          email: res.data.result.email,
          number: res.data.result.number,
        });
        router.push("/profil");
        setLoadingUpdateData(false);
      }
    } catch (error: any) {
      setLoadingUpdateData(false);
      if (error.response.data) {
        setMsgUpdateData(error.response.data.message);
        setTimeout(() => {
          setMsgUpdateData("");
        }, 3000);
      } else {
        console.log(error);
      }
    }
  };

  const newFotoProfil = async (id: string, body: any) => {
    try {
      setLoadingUpdateFoto(true);
      const res: any = await instance.patch(`/api/user/${id}`, body);
      if (res.data.result) {
        await updateUser({
          status: "updateFotoProfil",
          imgProfil: res.data.result.imgProfil,
        });
        router.push("/profil");
      }
      setLoadingUpdateFoto(false);
    } catch (error: any) {
      if (error.response) {
        setMessageNewFoto(error.response.data.message);
        setTimeout(() => {
          setMessageNewFoto("");
        }, 3000);
      } else {
        console.log(error);
      }
      setLoadingUpdateFoto(false);
    }
  };

  const deleteFoto = async (id: string, idFoto: string) => {
    try {
      setLoadingDelete(true);
      const res = await instance.put(`/api/user/${id}`, { idFoto });
      if (res.data.result) {
        await updateUser({
          status: "updateFotoProfil",
          imgProfil: res.data.result.imgProfil,
        });
        router.push("/profil");
        setLoadingDelete(false);
      }
    } catch (error) {
      console.log(error);
      setLoadingDelete(false);
    }
  };

  const deleteAccount = async (id: string) => {
    try {
      await signOut({ callbackUrl: "/register" });
      router.push("/register");
      await instance.delete(`/api/user/${id}`, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const [nextPassword, setNextPassword] = useState<boolean>(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [msgPassword, setMsgPassword] = useState("");
  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
    confNewPassword: "",
  });

  const kirimPassword = async (email: string, password: string) => {
    try {
      setLoadingPassword(true);
      const res = await instance.post(`/api/user/update`, { email, password });
      if (res.data.status) {
        setNextPassword(res.data.status);
        setLoadingPassword(false);
      }
    } catch (error: any) {
      setLoadingPassword(false);
      if (error.response.data) {
        setMsgPassword(error.response.data.message);
        setTimeout(() => {
          setMsgPassword("");
        }, 3000);
      } else {
        console.log(error);
      }
    }
  };

  const updatePassword = async (id: string, newPassword: string, confNewPassword: string) => {
    try {
      setLoadingPassword(true);
      const res = await instance.put(`/api/user/update/${id}`, {
        newPassword,
        confNewPassword,
      });

      if (res.data.status) {
        setNextPassword(false);
        setLoadingPassword(false);
        setPassword({
          ...password,
          oldPassword: "",
          newPassword: "",
          confNewPassword: "",
        });
      }
    } catch (error: any) {
      setLoadingPassword(false);
      if (error.response.data) {
        setMsgPassword(error.response.data.message);
        setTimeout(() => {
          setMsgPassword("");
        }, 3000);
      } else {
        console.log(error);
      }
    }
  };

  const { mutate } = useSWRConfig();
  const [ldlPatchBadge, setLdlPatchBadge] = useState(false);
  const patchBadge = async (id_user: string, badge: string[]) => {
    try {
      setLdlPatchBadge(true);
      const res = await instance.patch(
        `/api/user/check/${id_user}`,
        { badge },
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        },
      );
      if (res.data.status) {
        setLdlPatchBadge(false);
        mutate(`/api/user/leaderboard`);
        mutate(`/api/user?user_id=${res.data.result._id}`);
      }
    } catch (error) {
      setLdlPatchBadge(false);
      console.log(error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        dataRegister,
        setDataRegister,
        registerUser,
        loadingRegister,
        messageRegister,
        updateUsername,
        updateData,
        setUpdateData,
        loadingUpdateFoto,
        setLoadingUpdateFoto,
        updateFoto,
        setUpdateFoto,
        newFotoProfil,
        deleteFoto,
        loadingDelete,
        setLoadingDelete,
        loadingUpdateData,
        messageNewFoto,
        deleteAccount,
        setMessageRegister,
        msgUpdateData,
        nextPassword,
        loadingPassword,
        msgPassword,
        password,
        setPassword,
        kirimPassword,
        updatePassword,
        patchBadge,
        ldlPatchBadge,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
