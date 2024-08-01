import { NextRequest, NextResponse } from "next/server";

import { logger } from "@/lib/utils/logger";
import connectMongoDB from "@/lib/config/connectMongoDb";
import { bookAutServices } from "@/lib/services/bookauthor";
import { getLikeContent, getListBook } from "@/lib/middleware/likechek";
import { bookServices } from "@/lib/services/bookservices";
import { storyServices } from "@/lib/services/storyservices";

export const GET = async (req: NextRequest, { params }: { params: { user_id: string[] } }) => {
  await connectMongoDB();
  try {
    const { user_id } = params;

    let statusBook: any[] = [];
    const message = "Success get book by user id";
    const books = await bookServices.byId(user_id[0]);
    const results = await getListBook(books);

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

    const cerita = await storyServices.getStoryUser(user_id[0]);
    const storys = await getLikeContent(cerita);

    logger.info(message);
    return NextResponse.json(
      {
        status: true,
        statusCode: 200,
        message: message,
        books: results,
        storys: storys,
        statusBook,
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
