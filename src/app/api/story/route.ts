import { NextRequest, NextResponse } from "next/server";

import { logger } from "@/lib/utils/logger";
import connectMongoDB from "@/lib/config/connectMongoDb";
import { Player } from "@/lib/middleware/lvlPlayer";
import { storyServices } from "@/lib/services/storyservices";
import { userSevices } from "@/lib/services/userservices";

export const POST = async (req: NextRequest) => {
  await connectMongoDB();
  const { ception, user_id, book_id } = await req.json();

  try {
    const data = {
      ception,
      user_id,
      book_id,
      book: book_id,
      user: user_id,
    };

    if (!ception) {
      return NextResponse.json(
        {
          status: false,
          statsuCode: 422,
          message: "Tidak ada cerita yang di bagikan",
        },
        { status: 422 },
      );
    }

    const user = await userSevices.getUser(user_id);
    const jumlahKarakter = ception.split("");

    let player;
    let poin = 0;
    let myRank;
    let highRank;

    if (user && user.rank && user.rank.level !== undefined && user.rank.experience !== undefined) {
      player = new Player(user.rank.level, user.rank.experience);
      if (user.rank.level >= 1 && user.rank.level <= 4) {
        poin += 10;
      } else if (user.rank.level >= 5 && user.rank.level <= 8) {
        poin += 8;
      } else {
        poin += 5;
      }

      if (jumlahKarakter.length >= 11 && jumlahKarakter.length <= 99) {
        poin += 20;
      } else if (jumlahKarakter.length >= 100) {
        poin += 30;
      }

      player.gainExperience(poin);
      await userSevices.updateLvl(user_id, player);

      let img;
      let rankTinggi = {
        img: user?.rank?.rankTertinggi.img,
        no: user?.rank?.rankTertinggi.no,
      };
      if (user?.rank?.level <= 4) {
        img = "/rank-satu.png";
        if (user?.rank?.rankTertinggi?.no <= user?.rank?.level) {
          rankTinggi = {
            img: "/rank-satu.png",
            no: user?.rank?.level,
          };
        }
      } else if (user.rank.level >= 5 && user.rank.level <= 8) {
        img = "/rank-dua.png";
        if (user?.rank?.rankTertinggi?.no <= user?.rank?.level)
          rankTinggi = {
            img: "/rank-dua.png",
            no: user?.rank?.level,
          };
      } else if (user.rank.level >= 9 && user.rank.level <= 12) {
        img = "/rank-tiga.png";
        if (user?.rank?.rankTertinggi?.no <= user?.rank?.level) {
          rankTinggi = {
            img: "/rank-tiga.png",
            no: user?.rank?.level,
          };
        }
      } else if (user?.rank?.level > 12) {
        img = "/rank-empat.png";
        if (user?.rank?.rankTertinggi?.no <= user?.rank?.level) {
          rankTinggi = {
            img: "/rank-empat.png",
            no: user?.rank?.level,
          };
        }
      }

      myRank = await userSevices.updateRank(user_id, img && img);
      highRank = await userSevices.updateRankTertinggi(user_id, rankTinggi);
    } else {
      console.log("User atau rank tidak terdefinisi");
    }

    const result = await storyServices.upload(data);

    const rank = {
      ...player,
      point: poin,
      rankNow: myRank.rank.rankNow,
      rankTertinggi: highRank.rank.rankTertinggi,
    };

    logger.info("Success upload story");
    return NextResponse.json(
      {
        status: true,
        statusCode: 201,
        message: "Success upload story",
        result,
        rank,
      },
      { status: 201 },
    );
  } catch (error) {
    console.log(error);
    logger.error("Failed upload story" + error);
    return NextResponse.json(
      { status: false, statusCode: 500, message: "Failed upload story", error },
      { status: 500 },
    );
  }
};

export const GET = () => {
  const player = new Player(1, 20);

  player.gainExperience(1);
  console.log(`Level: ${player.level}, Experience: ${player.experience}`);

  console.log(player);

  return NextResponse.json(
    {
      status: true,
      statusCode: 201,
      message: "Success level up",
      result: player.levelUp,
    },
    { status: 201 },
  );
};
