import { NextRequest, NextResponse } from "next/server";

import { bookServices } from "@/lib/services/bookservices";
import { logger } from "@/lib/utils/logger";

export const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const searhcParams = new URLSearchParams(url.searchParams);
    const valueSearch = searhcParams.get("title");

    const result = await bookServices.searchBook(valueSearch);

    if (result.length === 0) {
      logger.error(`Buku "${valueSearch}" tidak ada.`);
      return NextResponse.json(
        {
          status: false,
          statusCode: 422,
          message: `Buku "${valueSearch}" tidak ada.`,
        },
        { status: 422 },
      );
    }

    logger.info("Success get book by search");
    return NextResponse.json(
      {
        status: true,
        statusCode: 200,
        message: "Success get book by search",
        result,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed get book by search");
    return NextResponse.json(
      {
        status: false,
        statusCode: 500,
        message: "Failed get book by search",
        error,
      },
      { status: 500 },
    );
  }
};
