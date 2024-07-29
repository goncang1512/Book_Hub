import { NextRequest, NextResponse } from "next/server";

import { bookAutServices } from "@/lib/services/bookauthor";
import { bookServices } from "@/lib/services/bookservices";
import { logger } from "@/lib/utils/logger";

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const book = await bookServices.byIdBook(params.id);
    const canvas = await bookAutServices.getChapter(params.id, "Rilis");
    const draft = await bookAutServices.getChapter(params.id, "Draft");
    const submitted = await bookAutServices.getChapter(params.id, "Submitted");

    const bookObject = book.toObject ? book.toObject() : book;

    logger.info("Success get detail book chapter");
    return NextResponse.json(
      {
        status: true,
        statusCode: 200,
        message: "Success get detail book chapter",
        result: { ...bookObject, canvas },
        draft,
        submitted,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed get detail book chapter");
    return NextResponse.json(
      {
        status: false,
        statusCode: 500,
        message: "Failed get detail book chapter",
        error,
      },
      { status: 500 },
    );
  }
};
