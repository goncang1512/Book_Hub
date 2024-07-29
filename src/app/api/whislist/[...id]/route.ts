import { NextRequest, NextResponse } from "next/server";

import connectMongoDB from "@/lib/config/connectMongoDb";
import { bookAutServices } from "@/lib/services/bookauthor";
import { logger } from "@/lib/utils/logger";
import { whislistSrv } from "@/lib/services/whilistservices";
import { getWhislist } from "@/lib/middleware/likechek";

export const GET = async (req: NextRequest, { params }: { params: { id: string[] } }) => {
  await connectMongoDB();
  try {
    const myListBook = await getWhislist(params.id[0]);

    let statusBook: any[] = [];
    if (myListBook && myListBook.length > 0) {
      for (let result of myListBook) {
        if (result?.jenis === "Cerpen") {
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
            statusBook.push({
              _id: null,
              book_id: result.book_id,
              status: null,
            });
          }
        }
      }
    }

    logger.info("Success get list book");
    return NextResponse.json(
      {
        status: true,
        statusCode: 200,
        message: "Success get list book",
        result: myListBook,
        statusBook,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed get list book" + error);
    return NextResponse.json(
      {
        status: false,
        statusCode: 500,
        message: "Failed get list book",
        error,
      },
      { status: 500 },
    );
  }
};

export const DELETE = async (req: NextRequest, { params }: { params: { id: string[] } }) => {
  try {
    const result = await whislistSrv.removeList(params.id[1], params.id[0]);

    logger.info("Success deleted list book");
    return NextResponse.json(
      {
        status: true,
        statusCode: 200,
        message: "Success deleted list book",
        result,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed delete list book");
    return NextResponse.json(
      {
        status: false,
        statusCode: 500,
        message: "Failed deleted list book",
        error,
      },
      { status: 500 },
    );
  }
};

export const PATCH = async (req: NextRequest, { params }: { params: { id: string[] } }) => {
  const { halaman, user_id } = await req.json();
  try {
    const result = await whislistSrv.updateHal(params.id[0], user_id, Number(halaman));

    logger.info("Success updated whislist");
    return NextResponse.json(
      {
        status: true,
        statusCode: 200,
        message: "Success updated whislist",
        result,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed updated whislist");
    return NextResponse.json(
      {
        status: false,
        statusCode: 500,
        message: "Failed updated whislist",
        error,
      },
      { status: 500 },
    );
  }
};
