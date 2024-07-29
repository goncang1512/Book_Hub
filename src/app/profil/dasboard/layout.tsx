"use client";
import * as React from "react";

import DasboardContextProvider from "@/lib/context/dasboardcontext";

export default function layout({ children }: { children: React.ReactNode }) {
  return <DasboardContextProvider>{children}</DasboardContextProvider>;
}
