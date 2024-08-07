import { NextRequest, NextResponse } from "next/server";

import { Player } from "@/lib/middleware/lvlPlayer";
import { likeServices } from "@/lib/services/likeservices";
import { userSevices } from "@/lib/services/userservices";
import { logger } from "@/lib/utils/logger";
import { naikPeringkat } from "@/lib/middleware/updateLvl";

export const POST = async (req: NextRequest) => {
  try {
    const { story_id, user_id, user_story } = await req.json();

    if (!user_id) {
      return NextResponse.json(
        { status: false, statusCode: 422, message: "Failed like story" },
        { status: 422 },
      );
    }

    const data = {
      story_id,
      user_id,
      user: user_id,
    };

    const like = await likeServices.checkLike(user_id, story_id);
    if (like) {
      logger.error("Failed like content " + like);
      return NextResponse.json(
        { status: false, statusCode: 422, message: "Content sudah di like" },
        { status: 422 },
      );
    }

    const user = await userSevices.getUser(user_story);

    if (user && user.rank && user.rank.level !== undefined && user.rank.experience !== undefined) {
      const player = new Player(user.rank.level, user.rank.experience);
      player.gainExperience(3);
      await userSevices.updateLvl(user_story, player);
      const update = new naikPeringkat(user.rank);
      const { img, rankTinggi } = update.checkLevel();
      await update.updateData(user._id, img, rankTinggi);
    }

    const result = await likeServices.like(data);

    logger.info("Success like content");
    return NextResponse.json(
      {
        status: true,
        statusCode: 201,
        message: "Success like content",
        result,
        user,
      },
      { status: 201 },
    );
  } catch (error) {
    logger.error("Gagal like content" + error);
    return NextResponse.json(
      { status: false, statusCode: 500, message: "Failed like content", error },
      { status: 500 },
    );
  }
};
