"use client";
import React, { useContext, useEffect, useRef } from "react";
import Link from "next/link";
import { GoogleIcon } from "@public/svg/assets";

import { Button } from "@/components/elements/button";
import { UserContext } from "@/lib/context/usercontext";
import { Input } from "@/components/elements/input";
import { OtpContext } from "@/lib/context/otpcontext";

export default function Register() {
  const { dataRegister, setDataRegister, registerUser, loadingRegister, messageRegister } =
    useContext(UserContext);
  const {
    containerInput,
    seconds,
    loadingOTP,
    kirimCodeOTP,
    waktuOTP,
    updateOtp,
    setSeconds,
    deletedOtp,
    setWaktuOTP,
    setContainerInput,
  } = useContext(OtpContext);

  useEffect(() => {
    let intervalId: any;
    if (waktuOTP) {
      setSeconds(60);
      intervalId = setInterval(() => {
        setSeconds((prevSeconds: any) => {
          if (prevSeconds > 0) {
            return prevSeconds - 1;
          } else {
            clearInterval(intervalId);
            setWaktuOTP(false);
            return 0;
          }
        });
      }, 1000);
    } else {
      clearInterval(intervalId);
      if (dataRegister.id_register) {
        deletedOtp(dataRegister.id_register);
      }
      setSeconds(0);
    }

    return () => clearInterval(intervalId);
  }, [waktuOTP, dataRegister.id_register]);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleInput = (e: any, index: number) => {
    const value = e.target.value;
    if (value.length > 1) {
      e.target.value = value.charAt(0);
    }
    if (value && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: any) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text");
    const pasteArray = pasteData.slice(0, inputsRef.current.length).split("");

    pasteArray.forEach((char: any, index: any) => {
      if (inputsRef.current[index]) {
        inputsRef.current[index].value = char;
      }
    });

    if (inputsRef.current[pasteArray.length - 1]) {
      inputsRef.current[pasteArray.length - 1]?.focus();
    }
  };

  const nameInput: string[] = ["one", "two", "three", "four", "five", "six"];
  useEffect(() => {
    if (containerInput) {
      const inputToFocus = inputsRef.current.find((input) => input?.name === "one");
      if (inputToFocus) {
        inputToFocus.focus();
      }
    }
  }, [containerInput]);

  return (
    <main className="md:px-0 px-3 flex flex-col items-center h-screen w-full justify-center">
      <p className="text-red-500 pb-3 text-base italic">{messageRegister}</p>
      <div className="md:w-96 w-full  shadow-xl border p-5 rounded-lg flex flex-col gap-4">
        <h1 className="w-full text-start font-bold text-lg">Sign Up</h1>
        <div className="hidden">
          <button className="bg-blue-100 py-3 w-full rounded-lg flex justify-center items-center gap-2">
            <GoogleIcon size={20} /> Sign up with Google
          </button>
        </div>
        <div className="hidden items-center justify-center">
          <hr className="w-full h-[0.4px] rounded-full border-0 bg-gray-400 mx-2" />
          <span className="text-gray-500 text-xl">or</span>
          <hr className="w-full h-[0.4px] rounded-full border-0 bg-gray-400 mx-2" />
        </div>
        <div className="w-full flex flex-col gap-4">
          {containerInput ? (
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                registerUser(e, dataRegister, setContainerInput);
              }}
            >
              <p className="text-red-500 text-center italic">Don&rsquo;t refresh this page</p>
              {containerInput && (
                <div
                  className={`flex items-center ${waktuOTP ? "justify-start" : "justify-end"}  `}
                >
                  <div className="flex justify-between items-center w-full">
                    <h1>Kode OTP</h1>
                    {waktuOTP ? (
                      <p className="text-base">Expired code {seconds}</p>
                    ) : (
                      <button
                        className="w-max h-max text-base text-blue-500"
                        disabled={loadingOTP}
                        type="button"
                        onClick={() => updateOtp(dataRegister)}
                      >
                        {loadingOTP ? "It's being sent" : "New code"}
                      </button>
                    )}
                  </div>
                </div>
              )}
              <div className="flex w-full gap-2">
                {nameInput.map((name: string, index: number) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputsRef.current[index] = el;
                    }}
                    className="border p-3 w-full text-center focus:outline-blue-500 rounded-sm"
                    maxLength={1}
                    name={`${name}`}
                    type="number"
                    onInput={(e) => handleInput(e, index)}
                    onPaste={handlePaste}
                  />
                ))}
              </div>
              <Button
                disabled={loadingRegister}
                label="ButtonRegister"
                size="login"
                type="submit"
                variant="login"
              >
                {loadingRegister ? "Loading..." : "Register"}
              </Button>
            </form>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                kirimCodeOTP(dataRegister);
              }}
            >
              <div className="w-full flex flex-col gap-4">
                <Input
                  container="labelFloat"
                  name="username"
                  required={true}
                  type="text"
                  value={dataRegister?.username}
                  varLabel="labelFloat"
                  variant="labelFloat"
                  onChange={(e) =>
                    setDataRegister({
                      ...dataRegister,
                      username: e.target.value,
                    })
                  }
                >
                  Username
                </Input>
                <Input
                  container="labelFloat"
                  name="email"
                  required={true}
                  type="text"
                  value={dataRegister?.email}
                  varLabel="labelFloat"
                  variant="labelFloat"
                  onChange={(e) => setDataRegister({ ...dataRegister, email: e.target.value })}
                >
                  E-mail
                </Input>
                <Input
                  container="labelFloat"
                  name="password"
                  type="password"
                  value={dataRegister?.password}
                  varLabel="labelFloat"
                  variant="labelFloat"
                  onChange={(e) =>
                    setDataRegister({
                      ...dataRegister,
                      password: e.target.value,
                    })
                  }
                >
                  Password
                </Input>
                <Input
                  container="labelFloat"
                  name="password"
                  required={true}
                  type="password"
                  value={dataRegister?.confpassword}
                  varLabel="labelFloat"
                  variant="labelFloat"
                  onChange={(e): void =>
                    setDataRegister({
                      ...dataRegister,
                      confpassword: e.target.value,
                    })
                  }
                >
                  Confirm Password
                </Input>
                <Button
                  disabled={loadingOTP}
                  label="buttonSignUP"
                  size="login"
                  type="submit"
                  variant="login"
                >
                  {loadingOTP ? "Loading..." : "Sign Up"}
                </Button>
              </div>
            </form>
          )}
          <p className="w-full text-center text-sm">
            Have an account?{" "}
            <Link className="text-blue-500" href={"/login"}>
              Log In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
