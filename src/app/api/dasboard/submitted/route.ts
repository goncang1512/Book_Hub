import { NextRequest, NextResponse } from "next/server";

import { bookAutServices } from "@/lib/services/bookauthor";
import { logger } from "@/lib/utils/logger";
import connectMongoDB from "@/lib/config/connectMongoDb";
import jwt from "jsonwebtoken";

export const GET = async (req: NextRequest) => {
  await connectMongoDB();
  const accessToken = req.headers.get("authorization")?.split(" ")[1];
  const decoded: any = await new Promise((resolve) => {
    jwt.verify(
      accessToken || "",
      process.env.NEXTAUTH_SECRET || "" || "",
      (error: any, encoded) => {
        resolve(encoded);
      },
    );
  });

  try {
    if (decoded?.role === "Developer") {
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
    } else {
      return NextResponse.json(
        { status: false, statusCode: 401, message: "Unauthorized" },
        { status: 401 },
      );
    }
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
