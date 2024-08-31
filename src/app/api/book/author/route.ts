import { NextRequest, NextResponse } from "next/server";

import { logger } from "@/lib/utils/logger";
import connectMongoDB from "@/lib/config/connectMongoDb";
import { bookServices } from "@/lib/services/bookservices";
import { getListBook, processBooks } from "@/lib/middleware/likechek";

export const GET = async (req: NextRequest) => {
  await connectMongoDB();
  const searchParams = req.nextUrl.searchParams;
  const page: string = searchParams.get("page") || "1";
  const limit: string = searchParams.get("limit") || "8";

  try {
    const getPageBook = await bookServices.getPage(parseInt(page), parseInt(limit));
    const results = await bookServices.getAll();

    const statusBookResults = await processBooks(getPageBook);
    let statusBook = [...statusBookResults];
    const hasil = await getListBook(getPageBook);

    logger.info("Success get all book");
    return NextResponse.json(
      {
        status: true,
        statusCode: 200,
        message: "Success get all books",
        result: hasil,
        totalPage: results.length,
        statusBook,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Gagal ambil semua buku" + error);
    return NextResponse.json(
      { status: false, statusCode: 500, message: "Failed get all book" },
      { status: 500 },
    );
  }
};
