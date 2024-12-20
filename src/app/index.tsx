import React, { useContext, useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

import OpenWindow from "@/components/layouts/openwindow";
import CanvasContextProvider from "@/lib/context/canvascontext";
import { useNewUsers } from "@/lib/swr/userswr";
import { logger } from "@/lib/utils/logger";
import { GlobalState } from "@/lib/context/globalstate";

export default function Index({ children }: { children: React.ReactNode }) {
  const { data: session, status, update: updateData }: any = useSession();
  const [hasOpened, setHasOpened] = useState(false);
  const pathname = usePathname();

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

  const { userDetail } = useNewUsers.getDetailUser(session?.user?._id);

  useEffect(() => {
    const updateProfil = async () => {
      try {
        await updateData({
          status: "UpdateProfil",
          badge: userDetail?.badge,
          rank: userDetail?.rank,
          role: userDetail?.role,
          accountStatus: userDetail?.status,
        });
      } catch (error) {
        logger.error(`${error}`);
      }
    };

    if (userDetail && status === "authenticated") {
      updateProfil();

      if (userDetail?.status === "banned") {
        signOut({ callbackUrl: "/login" });
      }
    }
  }, [userDetail]);

  useEffect(() => {
    const openedBefore = sessionStorage.getItem("openedBefore") === "true";
    setHasOpened(openedBefore);

    if (session?.user) {
      sessionStorage.setItem("openedBefore", "true");
    }

    const handleBeforeUnload = () => {
      sessionStorage.setItem("openedBefore", "false");
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

  if (status === "loading" && !session?.user && !authPage.includes(pathname) && !hasOpened) {
    return (
      <CanvasContextProvider>
        <OpenWindow />
      </CanvasContextProvider>
    );
  } else {
    return <CanvasContextProvider>{children}</CanvasContextProvider>;
  }
}
