import { NextRequest, NextResponse } from "next/server";

import { whislistSrv } from "@/lib/services/whilistservices";
import { logger } from "@/lib/utils/logger";

export const POST = async (req: NextRequest) => {
  try {
    const { user_id, book_id } = await req.json();

    const whislist = await whislistSrv.checkList(user_id, book_id);

    if (whislist) {
      return NextResponse.json(
        { status: false, statusCode: 422, message: "Sudah ada whislist" },
        { status: 422 },
      );
    }

    const result = await whislistSrv.addList(user_id, book_id);

    logger.info("Success add list");
    return NextResponse.json(
      {
        status: true,
        statusCode: 201,
        message: "Success add list",
        result,
      },
      { status: 201 },
    );
  } catch (error) {
    logger.error("Failed add list");
    return NextResponse.json(
      { status: false, statusCode: 500, message: "Failed add list", error },
      { status: 500 },
    );
  }
};
