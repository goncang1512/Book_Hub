import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";

import { logger } from "@/lib/utils/logger";
import { checkFotoProfil } from "@/lib/middleware/checkUser";
import { uploadImg } from "@/lib/middleware/uploadImg";
import { checkExistingFoto } from "@/lib/middleware/uploadImg";
import { bookServices } from "@/lib/services/bookservices";
import { storyServices } from "@/lib/services/storyservices";
import { userSevices } from "@/lib/services/userservices";

export const PATCH = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const fotoProfil = await req.json();
    const checkFoto = await checkFotoProfil(fotoProfil);

    if (checkFoto.condition) {
      return NextResponse.json(
        {
          status: false,
          statusCode: 422,
          message: checkFoto.message,
        },
        { status: 422 },
      );
    }

    const newImg: any = await uploadImg(fotoProfil);
    const updateFoto = {
      public_id: newImg.public_id,
      imgUrl: newImg.secure_url,
    };

    const result = await userSevices.updateFoto(params.id, updateFoto);

    logger.info("Success update foto profil user");
    return NextResponse.json(
      {
        status: true,
        statusCode: 200,
        message: "Success create user",
        result,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed update foto profil user");
    return NextResponse.json(
      {
        status: false,
        statusCode: 500,
        message: "Failed update foto profil user",
        error,
      },
      { status: 500 },
    );
  }
};

export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const { idFoto } = await req.json();
    await checkExistingFoto(idFoto);
    const result = await userSevices.deleteFotoProfil(params.id);

    logger.info("Success delete foto profil user");
    return NextResponse.json(
      {
        status: true,
        statusCode: 200,
        message: "Success delete foto profil user",
        result,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed delete foto profil user");
    return NextResponse.json(
      {
        status: false,
        statusCode: 500,
        message: "Failed delete foto profil user",
        error,
      },
      { status: 500 },
    );
  }
};

export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const user = await userSevices.deleteUserAccount(params.id);
    const accessToken = headers().get("authorization");

    jwt.verify(
      accessToken || "",
      process.env.NEXTAUTH_SECRET || "",
      async (error: any, decoded: any) => {
        if (decoded) {
          await checkExistingFoto(user.imgProfil.public_id);
          await storyServices.deleteManyByUser(params.id);
          await bookServices.deleteMany(params.id);

          const books = await bookServices.byId(params.id);
          for (const book of books) {
            await checkExistingFoto(book.imgBooks.public_id);
          }

          logger.info("Success delete user account");
          return NextResponse.json(
            {
              status: true,
              statusCode: 200,
              message: "Success deleted user account",
            },
            { status: 200 },
          );
        } else {
          logger.error("Access denied");
          return NextResponse.json(
            {
              status: false,
              statusCode: 403,
              message: "Access denied",
              error,
            },
            { status: 403 },
          );
        }
      },
    );
  } catch (error) {
    logger.error("Failed delete user account");
    return NextResponse.json(
      {
        status: false,
        statusCode: 500,
        message: "Failed delete user account",
        error,
      },
      { status: 500 },
    );
  }
};

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    let result;
    if (params.id === "leaderboard") {
      result = await userSevices.leaderbaord();
    } else {
      result = await userSevices.getUser(params.id);
    }

    logger.info("Success get leaderboard");
    return NextResponse.json(
      {
        status: true,
        statusCode: 200,
        message: "Success get leaderboard",
        result,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed get learderboard");
    return NextResponse.json(
      {
        status: false,
        statusCode: 500,
        message: "Failed get learderboard",
        error,
      },
      { status: 500 },
    );
  }
};
