import * as React from "react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

import { useUsers } from "@/lib/utils/useSwr";
import { logger } from "@/lib/utils/logger";

export default function Global({ children }: { children: React.ReactNode }) {
  const { data: session, update: updateData, status }: any = useSession();

  const { userDetail } = useUsers.detailUser(session?.user?.username);

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
  }, [userDetail?.badge, userDetail?.rank, userDetail?.role]);

  return <>{children}</>;
}
