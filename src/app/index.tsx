import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

import OpenWindow from "@/components/layouts/openwindow";
import CanvasContextProvider from "@/lib/context/canvascontext";
import { useNewUsers } from "@/lib/swr/userswr";
import { logger } from "@/lib/utils/logger";

export default function Index({ children }: { children: React.ReactNode }) {
  const { data: session, status, update: updateData }: any = useSession();
  const [hasOpened, setHasOpened] = useState(false);
  const pathname = usePathname();

  const { userDetail } = useNewUsers.getDetailUser(session?.user?._id);

  useEffect(() => {
    const updateProfil = async () => {
      try {
        await updateData({
          status: "UpdateProfil",
          badge: userDetail?.badge,
          rank: userDetail?.rank,
          role: userDetail?.role,
        });
      } catch (error) {
        logger.error(`${error}`);
      }
    };

    if (userDetail && status === "authenticated") {
      updateProfil();
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
