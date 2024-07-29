"use client";
import * as React from "react";
import { useContext } from "react";
import Link from "next/link";
import { GoogleIcon } from "@public/svg/assets";

import { Button } from "@/components/elements/button";
import { AuthContext } from "@/lib/context/authcontext";
import { Input } from "@/components/elements/input";

export default function Login() {
  const { loadingLogin, login, dataLogin, setDataLogin, messageAuth } = useContext(AuthContext);

  return (
    <main className="md:px-0 px-3 flex flex-col items-center h-screen w-full justify-center">
      <p className="text-red-500 pb-3 text-base italic">{messageAuth}</p>
      <div className="md:w-96 w-full shadow-xl border p-5 rounded-lg flex flex-col gap-4">
        <h1 className="w-full text-start font-bold text-lg">Log In</h1>
        <div className="hidden">
          <button className="bg-blue-100 py-3 w-full rounded-lg flex justify-center items-center gap-2">
            <GoogleIcon size={20} /> Continue with Google
          </button>
        </div>
        <div className="hidden items-center justify-center">
          <hr className="w-full h-[0.4px] rounded-full border-0 bg-gray-400 mx-2" />
          <span className="text-gray-500 text-xl">or</span>
          <hr className="w-full h-[0.4px] rounded-full border-0 bg-gray-400 mx-2" />
        </div>
        <form
          className="w-full flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            login(dataLogin);
          }}
        >
          <Input
            container="labelFloat"
            name="email"
            required={true}
            type="text"
            value={dataLogin?.email}
            varLabel="labelFloat"
            variant="labelFloat"
            onChange={(e) => setDataLogin({ ...dataLogin, email: e.target.value })}
          >
            E-Mail
          </Input>
          <Input
            container="labelFloat"
            name="password"
            required={true}
            type="password"
            value={dataLogin?.password}
            varLabel="labelFloat"
            variant="labelFloat"
            onChange={(e) => setDataLogin({ ...dataLogin, password: e.target.value })}
          >
            Password
          </Input>
          <p className="w-full text-end text-sm">Forgot Password</p>
          <Button
            className={`${loadingLogin && "cursor-not-allowed"}`}
            disabled={loadingLogin}
            size="login"
            type="submit"
            variant="login"
          >
            {loadingLogin ? "Loading..." : "Log In"}
          </Button>
          <p className="w-full text-center text-sm">
            Don&apos;t have account?{" "}
            <Link className="text-blue-500" href={"/register"}>
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
