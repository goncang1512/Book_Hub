import { NextRequest, NextResponse } from "next/server";

import { Player } from "@/lib/middleware/lvlPlayer";
import { newChapterBook } from "@/lib/middleware/sendNotif";
import BooksModels from "@/lib/models/booksModels";
import { bookAutServices } from "@/lib/services/bookauthor";
import { bookServ } from "@/lib/services/bookservices";
import { canvasSrv } from "@/lib/services/canvasservices";
import { msgServices } from "@/lib/services/message";
import { userSevices } from "@/lib/services/userservices";
import { logger } from "@/lib/utils/logger";
import { naikPeringkat } from "@/lib/middleware/updateLvl";

export const PATCH = async (req: NextRequest, { params }: { params: { slug: string[] } }) => {
  try {
    const { status, senderId, recipientId, message } = await req.json();
    const result = await bookAutServices.updateStatus(params.slug[0], status);
    const book = await BooksModels.findOne({ _id: result.book_id });

    let pesanNotif = `
    <p id="isPasted"><strong>Halo ${book?.writer},</strong></p>
    <p><br></p>
    ${message}
    `;

    const pesan = await msgServices.post({
      senderId,
      recipientId,
      message: pesanNotif,
    });

    if (result.status === "Rilis") {
      const currentDate = new Date();
      if (result.statUpdate === "Before") {
        await canvasSrv.statUpdate(params.slug[0]);
      }
      await bookServ.updateNewChapter(result.book_id, currentDate);
      await newChapterBook(result.book_id, recipientId, result, book);

      let player;
      const user = await userSevices.getUser(recipientId);
      if (
        user &&
        user.rank &&
        user.rank.level !== undefined &&
        user.rank.experience !== undefined
      ) {
        player = new Player(user.rank.level, user.rank.experience);
        let poin: number =
          result.statUpdate === "Before" ? 30 : result.statUpdate === "Updated" ? 15 : 30;
        player.gainExperience(poin);
        const level = await userSevices.updateLvl(recipientId, player);

        const updateLvl = new naikPeringkat(level.rank);
        const { img: imgRank, rankTinggi: riwayatRank } = updateLvl.checkLevel();
        await updateLvl.updateData(user._id, imgRank, riwayatRank);
      }
    }

    logger.info("Success update role user");
    return NextResponse.json(
      {
        status: true,
        statusCode: 200,
        message: "Success update role user",
        result,
        pesan,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed update role canvas" + error);
    return NextResponse.json(
      {
        status: false,
        statusCode: 500,
        message: "Failed update status canvas",
        error,
      },
      { status: 500 },
    );
  }
};
