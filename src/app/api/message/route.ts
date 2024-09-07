import { msgServices } from "@/lib/services/message";
import { logger } from "@/lib/utils/logger";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const { senderId, recipientId, message, type } = await req.json();
  try {
    const result = await msgServices.post({ senderId, recipientId, message, type });

    logger.info("Success send message");
    return NextResponse.json(
      { status: true, statusCode: 201, message: "Success send message", result },
      { status: 201 },
    );
  } catch (error) {
    logger.error("Failed send message");
    return NextResponse.json({
      status: false,
      statusCode: 500,
      message: "Failed send message",
      error,
    });
  }
};
