"use client";
import React from "react";

import OtpContextProvider from "@/lib/context/otpcontext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <OtpContextProvider>
      <div>{children}</div>
    </OtpContextProvider>
  );
}
