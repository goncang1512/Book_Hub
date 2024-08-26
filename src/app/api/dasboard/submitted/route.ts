import { NextResponse } from "next/server";

import { bookAutServices } from "@/lib/services/bookauthor";
import { logger } from "@/lib/utils/logger";
import connectMongoDB from "@/lib/config/connectMongoDb";

export const GET = async () => {
  await connectMongoDB();
  try {
    const result = await bookAutServices.submitted();

    logger.info("Successfully took the canvas submitted");
    return NextResponse.json(
      {
        status: true,
        statusCode: 200,
        message: "Successfully took the canvas submitted",
        result,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed to take the canvas submitted" + error);
    return NextResponse.json(
      {
        status: false,
        statusCode: 500,
        message: "Failed to take the canvas submitted",
        error,
      },
      { status: 500 },
    );
  }
};
