import { NextRequest, NextResponse } from "next/server";

import { getListBook } from "@/lib/middleware/likechek";
import { bookAutServices } from "@/lib/services/bookauthor";
import { logger } from "@/lib/utils/logger";
import { ResultsBook } from "@/lib/utils/types/booktypes.type";
import { getStatusBook } from "@/lib/middleware/bookware/statusbook";

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const hasil = await bookAutServices.mybook(params.id);
    const results: ResultsBook[] = await getListBook(hasil);
    const statusBook = await getStatusBook(results);

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
