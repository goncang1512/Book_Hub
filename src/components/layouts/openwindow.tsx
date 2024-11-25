import { GlobalState } from "@/lib/context/globalstate";
import React, { useContext, useEffect, useState } from "react";
import Picture from "../elements/image";

export default function OpenWindow() {
  const { setIsDarkMode } = useContext(GlobalState);

  useEffect(() => {
    const savedMode = localStorage.getItem("theme");
    if (savedMode === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const [text, setText] = useState({
    from: "from",
    grup: "Mogo Studio",
  });

  useEffect(() => {
    setText({
      from: "from",
      grup: "Mogo Studio",
    });
  }, []);

  return (
    <main className="w-screen h-screen fixed top-0 left-0 flex items-center justify-center bg-white dark:bg-primary-dark">
      <div className="flex-col h-screen flex items-center justify-between py-5">
        <div className="bg-transparent h-1 w-1" />
        <div className="flex flex-col gap-3 items-center justify-center">
          <Picture className="w-20 h-16" src="/svg/logoweb.svg" />
          <h1 className="font-bold">BookArcade</h1>
        </div>
        <div className="flex flex-col justify-center items-center">
          <p className="text-sm">{text.from}</p>
          <h1 className="font-bold">{text.grup}</h1>
        </div>
      </div>
    </main>
  );
}
