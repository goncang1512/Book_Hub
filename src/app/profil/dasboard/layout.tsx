"use client";
import * as React from "react";

import DasboardContextProvider from "@/lib/context/dasboardcontext";
import MessageContextProvider from "@/lib/context/messagecontext";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <DasboardContextProvider>
      <MessageContextProvider>{children}</MessageContextProvider>
    </DasboardContextProvider>
  );
}
