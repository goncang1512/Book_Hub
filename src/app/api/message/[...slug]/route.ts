import { NextRequest, NextResponse } from "next/server";

import { msgServices } from "@/lib/services/message";
import { logger } from "@/lib/utils/logger";
import connectMongoDB from "@/lib/config/connectMongoDb";

export const GET = async (req: NextRequest, { params }: { params: { slug: string[] } }) => {
  await connectMongoDB();
  try {
    let result;

    if (params.slug[0] === "detail") {
      result = await msgServices.getMsgDetail(params.slug[1]);
    } else {
      result = await msgServices.getMsgRecepient(params.slug[0]);
    }

    logger.info("Success get messages");
    return NextResponse.json(
      {
        status: true,
        statusCode: 200,
        message: "Success get messages",
        result,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed get messages : " + error);
    return NextResponse.json(
      { status: false, statusCode: 500, message: "Failed get messages", error },
      { status: 50 },
    );
  }
};

export const PUT = async (req: NextRequest, { params }: { params: { slug: string[] } }) => {
  try {
    const result = await msgServices.readMessage(params.slug[0]);

    logger.info("Success read message");
    return NextResponse.json(
      {
        status: true,
        statusCode: 200,
        message: "Success update message",
        result,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed update messages : ");
    return NextResponse.json(
      {
        status: false,
        statusCode: 500,
        message: "Failed update messages",
        error,
      },
      { status: 500 },
    );
  }
};

export const DELETE = async (req: NextRequest, { params }: { params: { slug: string[] } }) => {
  try {
    const result = await msgServices.deleteMsg(params.slug[0]);

    logger.info("Success deleted message");
    return NextResponse.json(
      {
        status: true,
        statusCode: 200,
        message: "Success deleted message",
        result,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed delete messages : ");
    return NextResponse.json(
      {
        status: false,
        statusCode: 500,
        message: "Failed delete messages",
        error,
      },
      { status: 500 },
    );
  }
};
