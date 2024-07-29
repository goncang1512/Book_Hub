import { NextRequest, NextResponse } from "next/server";

import { getListBook } from "@/lib/middleware/likechek";
import { bookAutServices } from "@/lib/services/bookauthor";
import { logger } from "@/lib/utils/logger";

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const hasil = await bookAutServices.mybook(params.id);
    const results = await getListBook(hasil);

    let statusBook: any[] = [];
    if (results.length > 0) {
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

    logger.info("Success get my book");
    return NextResponse.json(
      {
        status: true,
        statusCode: 200,
        message: "Success get my book",
        result: results,
        statusBook,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed get my book" + error);
    return NextResponse.json(
      {
        status: false,
        statusCode: 500,
        message: "Failed get my book",
      },
      { status: 500 },
    );
  }
};
