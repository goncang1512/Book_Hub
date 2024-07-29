import * as React from "react";
import { createContext, useContext, useState } from "react";

import instance from "../utils/fetch";
import { UserRegister } from "../utils/DataTypes.type";

import { UserContext } from "./usercontext";

export const OtpContext = createContext<any>(null);

export default function OtpContextProvider({ children }: { children: React.ReactNode }) {
  const { dataRegister, setDataRegister, setMessageRegister } = useContext(UserContext);
  const [containerInput, setContainerInput] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [loadingOTP, setLoadingOTP] = useState(false);
  const [waktuOTP, setWaktuOTP] = useState(false);

  const kirimCodeOTP = async (body: any) => {
    try {
      setLoadingOTP(true);
      const res = await instance.post("/api/user/check", body);
      setDataRegister({
        ...dataRegister,
        username: res.data.result.username,
        email: res.data.result.email,
        password: res.data.result.password,
        confpassword: res.data.result.confpassword,
        id_register: res.data.result.id_register,
      });
      setContainerInput(true);
      setLoadingOTP(false);
      setWaktuOTP(true);
      setTimeout(() => {
        setWaktuOTP(false);
      }, 60000);
    } catch (error: any) {
      setLoadingOTP(false);
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

  const updateOtp = async (body: UserRegister) => {
    try {
      setLoadingOTP(true);
      const res = await instance.put("/api/user/check", body);
      setDataRegister({
        ...dataRegister,
        username: res.data.result.username,
        email: res.data.result.email,
        password: res.data.result.password,
        confpassword: res.data.result.confpassword,
        id_register: res.data.result.id_register,
      });
      setLoadingOTP(false);
      setWaktuOTP(true);
      setTimeout(() => {
        setWaktuOTP(false);
      }, 60000);
    } catch (error: any) {
      setLoadingOTP(false);
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

  const deletedOtp = async (id: string) => {
    try {
      await instance.delete(`/api/user/check/${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <OtpContext.Provider
      value={{
        containerInput,
        seconds,
        loadingOTP,
        kirimCodeOTP,
        waktuOTP,
        updateOtp,
        setSeconds,
        deletedOtp,
        setWaktuOTP,
      }}
    >
      {children}
    </OtpContext.Provider>
  );
}
