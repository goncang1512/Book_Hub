import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

import OpenWindow from "@/components/layouts/openwindow";
import CanvasContextProvider from "@/lib/context/canvascontext";

export default function Index({ children }: { children: React.ReactNode }) {
  const { data: session, status }: any = useSession();
  const [hasOpened, setHasOpened] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const openedBefore = localStorage.getItem("openedBefore") === "true";
    setHasOpened(openedBefore);

    if (session?.user) {
      localStorage.setItem("openedBefore", "true");
    }

    const handleBeforeUnload = () => {
      localStorage.setItem("openedBefore", "false");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [session]);

  const authPage = ["/login", "/register"];

  if (status === "authenticated") {
    return <CanvasContextProvider>{children}</CanvasContextProvider>;
  }

  if (status === "loading" && !authPage.includes(pathname) && !hasOpened) {
    return (
      <CanvasContextProvider>
        <OpenWindow />
      </CanvasContextProvider>
    );
  } else {
    return <CanvasContextProvider>{children}</CanvasContextProvider>;
  }
}
