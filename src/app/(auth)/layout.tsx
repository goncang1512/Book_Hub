"use client";
import React from "react";

import OtpContextProvider from "@/lib/context/otpcontext";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <OtpContextProvider>
        <div>{children}</div>
      </OtpContextProvider>
    </>
  );
}
