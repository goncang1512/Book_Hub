import { Player } from "@/lib/middleware/lvlPlayer";
import { naikPeringkat } from "@/lib/middleware/updateLvl";
import { misiServices } from "@/lib/services/missionservices";
import { userSevices } from "@/lib/services/userservices";
import { logger } from "@/lib/utils/logger";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { user_id, mission_id, type } = await req.json();
    let result;
    const userMisi = await misiServices.getMisiUser(user_id, mission_id);
    const mission = await misiServices.getMission(mission_id);

    if (userMisi) {
      let statusMisi =
        mission?.max === userMisi?.process + 1 || userMisi.process > mission?.max ? true : false;
      result = await misiServices.updateMisiUser(
        user_id,
        mission_id,
        type,
        userMisi.process,
        statusMisi,
      );

      if (result.status) {
        const user: any = await userSevices.getUser(result.user_id);

        if (user) {
          const player = new Player(user.rank.level, user.rank.experience);
          player.gainExperience(35);
          const level = await userSevices.updateLvl(user._id, player);

          const updateLvl = new naikPeringkat(level.rank);
          const { img: imgRank, rankTinggi: riwayatRank } = updateLvl.checkLevel();
          await updateLvl.updateData(user._id, imgRank, riwayatRank);
        }
      }
    } else {
      result = await misiServices.addMisiUser(user_id, mission_id, type);
    }

    logger.info("Success finish mission");
    return NextResponse.json(
      { status: true, statusCode: 500, message: "Success finish mission", result },
      { status: 201 },
    );
  } catch (error) {
    logger.error("Failed finish mission : " + error);
    return NextResponse.json(
      { status: false, statusCode: 500, message: "Failed finish mission", error },
      { status: 500 },
    );
  }
};
