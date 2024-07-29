import React from "react";
import { GiBookmarklet } from "react-icons/gi";

export default function OpenWindow() {
  return (
    <main className="w-screen h-screen fixed top-0 left-0 flex items-center justify-center ">
      <div className="flex-col h-screen flex items-center justify-between py-5">
        <div className="bg-white h-1 w-1 text-white" />
        <GiBookmarklet size={50} />
        <div className="flex flex-col justify-center items-center">
          <p className="text-sm">from</p>
          <h1 className="font-bold">Mogo Studio</h1>
        </div>
      </div>
    </main>
  );
}
