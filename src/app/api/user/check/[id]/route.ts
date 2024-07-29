import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import VeryfiedModel from "@/lib/models/veryfiedEmailModel";
import { logger } from "@/lib/utils/logger";
import { dasboardServices } from "@/lib/services/dasboard";
import { veryfiedServices } from "@/lib/services/userservices";

export const PATCH = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const accessToken = req.headers.get("authorization")?.split(" ")[1];
  const { badge } = await req.json();

  try {
    return new Promise<void | Response>((resolve) => {
      jwt.verify(
        accessToken || "",
        process.env.NEXTAUTH_SECRET || "",
        async (error: any, encoded: any) => {
          if (encoded && encoded?.role === "Developer") {
            const result = await dasboardServices.patchBadge(params.id, badge);

            logger.info("Succes patch badge user");
            resolve(
              NextResponse.json(
                {
                  status: true,
                  statusCode: 200,
                  message: "Success patch badge user",
                  result,
                },
                { status: 200 },
              ),
            );
          } else {
            resolve(
              NextResponse.json(
                { status: false, statusCode: 401, message: "Unauthorized" },
                { status: 401 },
              ),
            );
          }
        },
      );
    });
  } catch (error) {
    logger.error("Failed patch badge user");
    return NextResponse.json(
      {
        status: false,
        statusCode: 400,
        message: "Failed patch badge user",
        error,
      },
      { status: 400 },
    );
  }
};

export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const result = await VeryfiedModel.findOneAndUpdate(
      { _id: params.id },
      { $set: { codeOtp: null } },
      { new: true },
    );

    logger.info("Success deleted code otp");
    return NextResponse.json(
      {
        status: true,
        statusCode: 200,
        message: "Success deleted code otp",
        result,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed deleted code otp");
    return NextResponse.json(
      {
        status: false,
        statusCode: 500,
        message: "Failed deleted code otp",
      },
      { status: 500 },
    );
  }
};

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const result = await veryfiedServices.get(params.id);

    if (!result) {
      logger.info("Failed get code otp");
      return NextResponse.json(
        {
          status: true,
          statusCode: 404,
          message: "Failed get code otp",
          result,
        },
        { status: 404 },
      );
    }

    logger.info("Success get code otp");
    return NextResponse.json(
      {
        status: true,
        statusCode: 200,
        message: "Success get code otp",
        result,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed deleted code otp");
    return NextResponse.json(
      {
        status: false,
        statusCode: 500,
        message: "Failed deleted code otp",
      },
      { status: 500 },
    );
  }
};
