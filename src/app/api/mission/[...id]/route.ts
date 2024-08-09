import { Player } from "@/lib/middleware/lvlPlayer";
import { naikPeringkat } from "@/lib/middleware/updateLvl";
import { misiServices } from "@/lib/services/missionservices";
import { userSevices } from "@/lib/services/userservices";
import { logger } from "@/lib/utils/logger";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: { id: string[] } }) => {
  try {
    const result = await misiServices.getMisiUserId(params.id[0]);

    logger.info("Success get mission user");
    return NextResponse.json(
      { status: true, statusCode: 200, message: "Success get mission user", result },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed get mission user");
    return NextResponse.json(
      { status: false, statusCode: 500, message: "Failed get mission user", error },
      { status: 500 },
    );
  }
};

export const PATCH = async (req: NextRequest, { params }: { params: { id: string[] } }) => {
  try {
    const misiUserId = params.id[0];
    const { point }: { point: number } = await req.json();
    const misi = await misiServices.getMyMisi(misiUserId);

    if (!misi.status) {
      return NextResponse.json(
        { status: false, statusCode: 422, message: "Misi belum selesai" },
        { status: 422 },
      );
    }

    let result;
    let player;
    if (misi.status) {
      const user: any = await userSevices.getUser(misi.user_id);

      if (user) {
        player = new Player(user.rank.level, user.rank.experience);
        player.gainExperience(point);
        const level = await userSevices.updateLvl(user._id, player);

        const updateLvl = new naikPeringkat(level.rank);
        const { img: imgRank, rankTinggi: riwayatRank } = updateLvl.checkLevel();
        await updateLvl.updateData(user._id, imgRank, riwayatRank);
        result = await misiServices.updateMyMisi(misiUserId);
      }
    }

    logger.info("Success claim mission");
    return NextResponse.json(
      {
        status: true,
        statusCode: 200,
        message: "Success claim mission",
        result,
        player: { ...player, point },
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed claim mission: " + error);
    return NextResponse.json(
      { status: false, statusCode: 500, message: "Failed claim mission", error },
      { status: 500 },
    );
  }
};
