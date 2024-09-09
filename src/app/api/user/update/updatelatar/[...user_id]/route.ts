import { uploadBG } from "@/lib/middleware/uploadImg";
import { userSevices } from "@/lib/services/userservices";
import { logger } from "@/lib/utils/logger";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest, { params }: { params: { user_id: string[] } }) => {
  const { latar, size, type } = await req.json();
  try {
    const user = await userSevices.getUser(params.user_id[0]);

    let dataBg = {
      public_id: "",
      secure_url: "",
    };

    if (latar) {
      const img: { public_id: string; secure_url: string } = await uploadBG(
        {
          background: latar,
          size,
          type,
        },
        user?.profileGround?.public_id,
      );

      if (img.public_id === "" || img.secure_url === "") {
        return NextResponse.json(
          { status: false, statusCode: 422, message: "Failed updated background" },
          { status: 422 },
        );
      }

      dataBg = {
        secure_url: img.secure_url,
        public_id: img.public_id,
      };
    } else {
      dataBg = {
        public_id: "default_id",
        secure_url: "/new-cover-profil.png",
      };
    }

    const result = await userSevices.updateBg(params.user_id[0], {
      public_id: dataBg.public_id,
      urlLatar: dataBg.secure_url,
    });

    logger.info("Success change porfile background");
    return NextResponse.json(
      { status: true, statusCode: 200, message: "Success change profile background", result },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed change profile background");
    return NextResponse.json(
      { status: false, statusCode: 500, message: "Failed change profile background", error },
      { status: 500 },
    );
  }
};

//   const result = await UserModels.updateMany(
//     {},
//     {
//       $set: {
//         profileGround: {
//           public_id: "default_id",
//           urlLatar: "/new-cover-profil.png",
//         },
//       },
//     },
//     { new: true },
//   );

//   return NextResponse.json(
//     { status: true, statusCode: 200, message: "Success updated", result },
//     { status: 200 },
//   );
// };
