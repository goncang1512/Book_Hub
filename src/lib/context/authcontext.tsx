import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { createContext, useState } from "react";
import instance from "../utils/fetch";
import { logger } from "../utils/logger";
import { AuthContextType } from "../utils/provider.type";

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export default function AuthCntextProvider({ children }: { children: React.ReactNode }) {
  const { push } = useRouter();
  const { update } = useSession();
  const [loadingLogin, setLoadingLogin] = useState<boolean>(false);
  const [messageAuth, setMessageAuth] = useState<string>("");
  const [dataLogin, setDataLogin] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });

  const login = async (body: { email: string; password: string }) => {
    try {
      setLoadingLogin(true);
      const res = await signIn("credentials", {
        redirect: false,
        email: body.email,
        password: body.password,
        callbackUrl: "/profil",
      });
      if (!res?.error) {
        push("/profil");
        setLoadingLogin(false);
      } else {
        setMessageAuth(res?.error);
        setLoadingLogin(false);
        setTimeout(() => {
          setMessageAuth("");
        }, 3000);
      }
    } catch (error) {
      logger.error(`${error}`);
      setLoadingLogin(false);
    }
  };

  const [trueCode, setTrueCode] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [msgUpdateData, setMsgUpdateData] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [codeOtp, setCodeOtp] = useState("");

  const sendNewEmail = async (oldEmail: string, newEmail: string, user_id: string) => {
    try {
      setLoadingEmail(true);
      const res = await instance.post(`/api/user/email/${user_id}`, { oldEmail, newEmail });
      if (res.data.status) {
        setTrueCode(res.data.status);
        setLoadingEmail(false);
        setNewEmail("");
        setCodeOtp("");
      }
    } catch (error: any) {
      if (error.response.data) {
        setLoadingEmail(false);
        setMsgUpdateData(error.response.data.message);
        setTimeout(() => {
          setMsgUpdateData("");
        }, 3000);
      } else {
        logger.error(`${error}`);
      }
    }
  };

  const updateEmail = async (codeOtp: string, user_id: string) => {
    try {
      setLoadingEmail(true);
      const res = await instance.patch(`/api/user/email/${user_id}`, { codeOtp });
      await update({
        status: "newEmail",
        email: res.data.result.email,
      });
      setLoadingEmail(false);
      setTrueCode(false);
      setNewEmail("");
      setCodeOtp("");
    } catch (error: any) {
      if (error.response.data) {
        setLoadingEmail(false);
        setMsgUpdateData(error.response.data.message);
        setTimeout(() => {
          setMsgUpdateData("");
        }, 3000);
      } else {
        logger.error(`${error}`);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        sendNewEmail,
        updateEmail,
        setDataLogin,
        setNewEmail,
        setCodeOtp,
        loadingLogin,
        dataLogin,
        messageAuth,
        trueCode,
        msgUpdateData,
        loadingEmail,
        newEmail,
        codeOtp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
