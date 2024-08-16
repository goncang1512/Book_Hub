import { NextRequest, NextResponse } from "next/server";

import { logger } from "@/lib/utils/logger";
import { canvasSrv } from "@/lib/services/canvasservices";
import connectMongoDB from "@/lib/config/connectMongoDb";

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
  await connectMongoDB();
  try {
    const canvas_id = params.id;

    const result = await canvasSrv.getByIdCanvas(canvas_id);

    logger.info("Success get canvas");
    return NextResponse.json(
      { status: true, statusCode: 200, message: "Success get canvas", result },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed get readers");
    return NextResponse.json(
      {
        status: false,
        statusCode: 500,
        message: "Failed get readers",
        error,
      },
      { status: 500 },
    );
  }
};
