import { dasboardServices } from "@/lib/services/dasboard";
import { logger } from "@/lib/utils/logger";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const PATCH = async (req: NextRequest, { params }: { params: { slug: string[] } }) => {
  const { status } = await req.json();
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
      const result = await dasboardServices.updateStatusUser(params.slug[0], status);

      logger.info("Success update status user");
      return NextResponse.json(
        { status: true, statusCode: 200, message: "Success update status user", result },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        { status: false, statusCode: 401, message: "Unauthorized" },
        { status: 401 },
      );
    }
  } catch (error) {
    logger.error("Failed update status user");
    return NextResponse.json(
      { status: false, statusCode: 500, message: "Failed update status user", error },
      { status: 500 },
    );
  }
};
