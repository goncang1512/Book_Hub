import * as React from "react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

import { useUsers } from "@/lib/utils/useSwr";

export default function Global({ children }: { children: React.ReactNode }) {
  const { data: session, update: updateData, status }: any = useSession();

  const { userDetail } = useUsers.detailUser(session?.user?._id);

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
        console.log(error);
      }
    };

    if (userDetail && status === "authenticated") {
      updateProfil();
    }
  }, [userDetail?.badge, userDetail?.rank, userDetail?.role]);

  return <>{children}</>;
}
