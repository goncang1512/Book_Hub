import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

import UserModels from "@/lib/models/users";
import { logger } from "@/lib/utils/logger";

export const POST = async (req: NextRequest) => {
  try {
    const { email, password } = await req.json();
    const user = await UserModels.findOne({ email: email });

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return NextResponse.json(
        { status: false, statusCode: 422, message: "Password salah" },
        { status: 422 },
      );
    }

    logger.info("Success check password user");
    return NextResponse.json(
      { status: true, statusCode: 200, message: "Success check password user" },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed post password account");
    return NextResponse.json(
      {
        status: false,
        statusCode: 500,
        message: "Failed post password account",
        error,
      },
      { status: 500 },
    );
  }
};
