import * as React from "react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

import { useNewUsers } from "@/lib/swr/userswr";
import { logger } from "@/lib/utils/logger";

export default function Global({ children }: { children: React.ReactNode }) {
  const { data: session, update: updateData, status }: any = useSession();

  const { userDetail }: any = useNewUsers.getDetailUser(session?.user?._id);

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

  return <>{children}</>;
}
