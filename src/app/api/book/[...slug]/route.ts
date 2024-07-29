import { NextRequest, NextResponse } from "next/server";

import { logger } from "@/lib/utils/logger";
import connectMongoDB from "@/lib/config/connectMongoDb";
import { checkExistingFoto as deleteCover, updateCover } from "@/lib/middleware/uploadImg";
import { checkFotoProfil as checkCover } from "@/lib/middleware/checkUser";
import { bookAutServices } from "@/lib/services/bookauthor";
import { getLikeContent, getListBook } from "@/lib/middleware/likechek";
import { bookServices } from "@/lib/services/bookservices";
import { storyServices } from "@/lib/services/storyservices";
import { whislistSrv } from "@/lib/services/whilistservices";

export const GET = async (req: NextRequest, { params }: { params: { slug: string[] } }) => {
  await connectMongoDB();
  try {
    const { slug } = params;

    let results;
    let message: string;
    let statusBook: any[] = [];
    let storyWithLike: any;

    if (slug[0] === "detailbook") {
      message = "Success get detail book by id";
      results = await bookServices.byIdBook(slug[1]);
      const storys: any = await storyServices.getIdBook(params.slug[1]);
      storyWithLike = await getLikeContent(storys);

      if (results) {
        if (results.jenis === "Cerpen") {
          const canvas = await bookAutServices.getCerpen(results._id);
          if (canvas.length > 0) {
            canvas.forEach((item) => {
              statusBook.push({
                _id: item._id,
                book_id: item.book_id,
                status: item.status,
              });
            });
          } else {
            statusBook.push({ _id: null, book_id: results._id, status: null });
          }
        }
      }
    } else {
      message = "Success get book by user id";
      const books = await bookServices.byId(params.slug[0]);
      results = await getListBook(books);

      if (results && results.length > 0) {
        for (let result of results) {
          if (result.jenis === "Cerpen") {
            const canvas = await bookAutServices.getCerpen(result._id);
            if (canvas.length > 0) {
              canvas.forEach((item) => {
                statusBook.push({
                  _id: item._id,
                  book_id: item.book_id,
                  status: item.status,
                });
              });
            } else {
              statusBook.push({ _id: null, book_id: result._id, status: null });
            }
          }
        }
      }
    }

    logger.info(message);
    return NextResponse.json(
      {
        status: true,
        statusCode: 200,
        message: message,
        result: results,
        statusBook,
        story: storyWithLike,
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
    const result = await bookServices.deleteBook(params.slug[0]);
    await deleteCover(result?.imgBooks?.public_id);
    await whislistSrv.deleteMany(params.slug[0]);

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

    const data = {
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
