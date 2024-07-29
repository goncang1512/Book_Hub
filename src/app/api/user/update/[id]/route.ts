import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

import { checkExistingUserUpdate } from "@/lib/middleware/checkUser";
import { logger } from "@/lib/utils/logger";
import { userSevices } from "@/lib/services/userservices";

export const PATCH = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const { username, alamat, number, email } = await req.json();
    const data = { username, alamat, number, email };

    const existingUser = await checkExistingUserUpdate(email, username, params.id);
    if (existingUser.status) {
      return NextResponse.json(
        { status: false, statusCode: 422, message: existingUser.message },
        { status: 422 },
      );
    }

    const result = await userSevices.patch(params.id, data);

    logger.info("Success update user account");
    return NextResponse.json(
      {
        status: true,
        statusCode: 200,
        message: "Success udpate user account",
        result,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed update user account");
    return NextResponse.json(
      {
        status: false,
        statusCode: 500,
        message: "Failed update user account",
        error,
      },
      { status: 500 },
    );
  }
};

export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { newPassword, confNewPassword } = await req.json();
  try {
    if (newPassword !== confNewPassword) {
      return NextResponse.json(
        {
          status: false,
          statusCode: 422,
          message: "Password dan Konfirmasi Password tidak sama",
        },
        { status: 422 },
      );
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);
    const result = await userSevices.updatePassword(params.id, hashPassword);

    logger.info("Success update password user");
    return NextResponse.json(
      {
        status: true,
        statusCode: 200,
        message: "Success update password user",
        result,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed update password user");
    return NextResponse.json(
      {
        status: false,
        statusCode: 500,
        message: "Failed update password user",
        error,
      },
      { status: 500 },
    );
  }
};
