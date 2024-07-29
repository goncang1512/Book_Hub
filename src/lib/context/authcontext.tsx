import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { createContext, useState } from "react";

export const AuthContext = createContext<any>(null);

export default function AuthCntextProvider({ children }: { children: React.ReactNode }) {
  const { push } = useRouter();
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
      console.log("dari error", error);
      setLoadingLogin(false);
    }
  };

  return (
    <AuthContext.Provider value={{ loadingLogin, login, dataLogin, setDataLogin, messageAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
