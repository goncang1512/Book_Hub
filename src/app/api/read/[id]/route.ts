import { NextRequest, NextResponse } from "next/server";

import CanvasModels from "@/lib/models/canvasModels";
import { bookAutServices } from "@/lib/services/bookauthor";
import { logger } from "@/lib/utils/logger";

export const PATCH = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const { story, chapter, wordCount, judul, book_id, status } = await req.json();

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

    const existing = await bookAutServices.existingBook(book_id, params.id, chapter);
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

    const result = await bookAutServices.updateCanvas(story, judul, chapter, status, params.id);

    logger.info("Success updated canvas");
    return NextResponse.json(
      {
        status: true,
        statusCode: 200,
        message: "Success updated canvas",
        result,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed updated canvas");
    return NextResponse.json(
      {
        status: false,
        statusCode: 500,
        message: "Failed updated canvas",
        error,
      },
      { status: 500 },
    );
  }
};

export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const result = await bookAutServices.deleted(params.id);

    logger.info("Success deleted canvas");
    return NextResponse.json(
      {
        status: true,
        statusCode: 200,
        message: "Success deleted canvas",
        result,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed deleted canvas");
    return NextResponse.json(
      {
        status: false,
        statusCode: 500,
        message: "Failed deleted canvas",
        error,
      },
      { status: 500 },
    );
  }
};

export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const { user_id } = await req.json();

    if (!user_id) {
      logger.error("Tidak ada user id");
      return NextResponse.json(
        { status: false, statusCode: 422, message: "Tidak ada user id" },
        { status: 422 },
      );
    }

    const readers = await CanvasModels.findById({ _id: params.id });
    if (!readers) {
      return NextResponse.json(
        {
          status: false,
          statusCode: 404,
          message: "readers not found",
        },
        { status: 404 },
      );
    }

    if (readers.readers.includes(user_id)) {
      return NextResponse.json(
        {
          status: false,
          statusCode: 422,
          message: "User has already read this readers",
        },
        { status: 422 },
      );
    }

    const result = await bookAutServices.addViewers(user_id, params.id);

    logger.info("Success updated readers");
    return NextResponse.json(
      {
        status: true,
        statusCode: 200,
        message: "Success updated readers",
        result,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed updated readers");
    return NextResponse.json(
      {
        status: false,
        statusCode: 400,
        message: "Failed updated readers",
        error,
      },
      { status: 400 },
    );
  }
};
