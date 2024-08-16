import { NextRequest, NextResponse } from "next/server";

import { logger } from "@/lib/utils/logger";
import { bookAutServices } from "@/lib/services/bookauthor";
import connectMongoDB from "@/lib/config/connectMongoDb";
import { bookServices } from "@/lib/services/bookservices";

export const POST = async (req: NextRequest) => {
  try {
    const { user_id, book_id, judul, story, wordCount, chapter, status } = await req.json();

    if (wordCount < 300) {
      return NextResponse.json(
        {
          status: false,
          statusCode: 500,
          message: "Satu halaman minimal 300 kata",
        },
        { status: 422 },
      );
    }

    const existing = await bookAutServices.existing(book_id, chapter);
    if (existing) {
      return NextResponse.json(
        {
          status: false,
          statusCode: 500,
          message: "Tidak boleh ada chapter yang sama",
        },
        { status: 422 },
      );
    }

    const lastCanvas = await bookAutServices.lastChap(book_id);
    const newChapterNumber = lastCanvas ? lastCanvas.chapter + 1 : 1;
    const result = await bookAutServices.post({
      user_id,
      book_id,
      judul,
      story,
      status,
      statUpdate: "Before",
      book: book_id,
      chapter: chapter ? chapter : newChapterNumber,
    });

    logger.info("Success add canvas");
    return NextResponse.json(
      {
        status: true,
        statusCode: 201,
        message: "Success add canvas",
        result,
      },
      { status: 201 },
    );
  } catch (error) {
    logger.error("Failed add canvas");
    return NextResponse.json(
      { status: false, statusCode: 500, message: "Failed add canvas", error },
      { status: 500 },
    );
  }
};

export const GET = async (req: NextRequest) => {
  await connectMongoDB();
  try {
    const searchParams = new URLSearchParams(req.url.split("?")[1]);
    const book_id: any = searchParams.get("id");
    const chapterStr: any = searchParams.get("chapter");

    const canvas = await bookAutServices.getChapter(book_id, "Rilis");
    const result = await bookAutServices.readBook(chapterStr);
    const book = await bookServices.byIdBook(book_id);

    const chapterIndex = canvas.findIndex((chap) => String(chap._id) === chapterStr);
    const nextChapter =
      chapterIndex !== -1 && chapterIndex < canvas.length - 1 ? canvas[chapterIndex + 1]._id : null;
    const prevChapter = chapterIndex > 0 ? canvas[chapterIndex - 1]._id : null;

    const dataObject = result.toObject ? result.toObject() : result;

    logger.info("Success get canvas");
    return NextResponse.json(
      {
        status: true,
        statusCode: 200,
        message: "Success get canvas",
        result: { ...dataObject, nextChapter, prevChapter, jenis: book.jenis },
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed get canvas" + error);
    return NextResponse.json(
      { status: false, statusCode: 500, message: "Failed get canvas", error },
      { status: 500 },
    );
  }
};
