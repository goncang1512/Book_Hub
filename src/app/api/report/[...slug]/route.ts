import reportSrv from "@/lib/services/reportservices";
import { logger } from "@/lib/utils/logger";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (req: NextRequest, { params }: { params: { slug: string[] } }) => {
  const report_id = params.slug[0];
  try {
    const result = await reportSrv.deleteOne(report_id);

    logger.info("Success deleted report");
    return NextResponse.json(
      { status: true, statusCode: 200, message: "Success deleted report", result },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed deleted report");
    return NextResponse.json(
      { status: false, statusCode: 500, message: "Failed deleted report", error },
      { status: 500 },
    );
  }
};
