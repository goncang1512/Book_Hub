import { NextRequest, NextResponse } from "next/server";

import { logger } from "@/lib/utils/logger";
import connectMongoDB from "@/lib/config/connectMongoDb";
import { updateCover } from "@/lib/middleware/uploadImg";
import { checkFotoProfil as checkCover } from "@/lib/middleware/checkUser";
import { getBalasan, getLikeContent } from "@/lib/middleware/likechek";
import { bookServices } from "@/lib/services/bookservices";
import { storyServices } from "@/lib/services/storyservices";
import { getMyFollower } from "@/lib/middleware/getmyfollower";
import { DateBookType } from "@/lib/utils/types/booktypes.type";

export const GET = async (req: NextRequest, { params }: { params: { slug: string[] } }) => {
  await connectMongoDB();
  try {
    const { slug } = params;

    const { results, statusBook } = await bookServices.getContentSingle(slug[1]);
    const storys: any = await storyServices.getIdBook(params.slug[1]);
    const storyWithLike = await getLikeContent(storys);

    let myFollower;
    if (slug[2]) {
      myFollower = await getMyFollower(slug[2]);
    }

    const hasil = await getBalasan(storyWithLike);

    logger.info("Success get detail book by id");
    return NextResponse.json(
      {
        status: true,
        statusCode: 200,
        message: "Success get detail book by id",
        result: results,
        statusBook,
        story: hasil,
        myFollower: myFollower && myFollower,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Gagal ambil buku" + error);
    return NextResponse.json(
      { status: false, statusCode: 500, message: "Failed get book" },
      { status: 500 },
    );
  }
};

export const DELETE = async (req: NextRequest, { params }: { params: { slug: string[] } }) => {
  await connectMongoDB();
  try {
    const result = await bookServices.deleteOneBook(params.slug[0]);

    logger.info("Success deleted book");
    return NextResponse.json(
      {
        status: true,
        statusCode: 200,
        message: "Success deleted book",
        result,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Gagal deleted buku" + error);
    return NextResponse.json(
      { status: false, statusCode: 500, message: "Failed deleted book" },
      { status: 500 },
    );
  }
};

export const PATCH = async (req: NextRequest, { params }: { params: { slug: string[] } }) => {
  try {
    const { title, writer, sinopsis, terbit, imgBooks, genre } = await req.json();
    const book = await bookServices.byIdBook(params.slug[0]);

    let imgDetail;
    if (imgBooks.size === 0 && imgBooks.type === "" && imgBooks.img === "") {
      imgDetail = book.imgBooks;
    } else {
      const check = await checkCover(imgBooks);
      if (check.condition) {
        return NextResponse.json(
          { status: false, statusCode: 422, message: check.message },
          { status: 422 },
        );
      }

      const cover: any = await updateCover(book.imgBooks.public_id, imgBooks);
      imgDetail = {
        public_id: cover.public_id,
        imgUrl: cover.secure_url,
      };
    }

    const data: DateBookType = {
      title,
      writer,
      sinopsis,
      terbit,
      imgBooks: imgDetail,
      genre,
    };

    const result = await bookServices.update(data, params.slug[0]);

    logger.info("Success update book");
    return NextResponse.json(
      {
        status: true,
        statusCode: 200,
        messsage: "Success update book",
        result,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Gagal update buku" + error);
    return NextResponse.json(
      { status: false, statusCode: 500, message: "Failed updated book" },
      { status: 500 },
    );
  }
};
