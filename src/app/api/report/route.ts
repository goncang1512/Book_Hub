import reportSrv from "@/lib/services/reportservices";
import { logger } from "@/lib/utils/logger";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const { user_id, message, report, from } = await req.json();
  try {
    const result = await reportSrv.post({ user_id, message, report, from });

    logger.info("Success make report");
    return NextResponse.json(
      { status: true, statusCode: 201, message: "Success make report", result },
      { status: 201 },
    );
  } catch (error) {
    logger.error("Failed make report");
    return NextResponse.json(
      { status: false, statusCode: 500, messaga: "Failed make report", error },
      { status: 500 },
    );
  }
};

export const GET = async () => {
  try {
    const result = await reportSrv.getAll();

    logger.info("Success get all report");
    return NextResponse.json(
      { status: true, statusCode: 200, message: "Success get all report", result },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed get all report" + error);
    return NextResponse.json(
      { status: false, statusCode: 500, message: "Failed get all report", error },
      { status: 500 },
    );
  }
};
