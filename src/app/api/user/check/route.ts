import crypto from "crypto";
import bcrypt from "bcrypt";

import { NextRequest, NextResponse } from "next/server";

import { logger } from "@/lib/utils/logger";
import { checkExistingUser } from "@/lib/middleware/checkUser";
import { sendEmail } from "@/lib/middleware/mailer";
import connectMongoDB from "@/lib/config/connectMongoDb";
import { encriptTs, decrypt } from "@/lib/middleware/ecriptDescript";
import { veryfiedServices } from "@/lib/services/userservices";

export const POST = async (req: NextRequest) => {
  await connectMongoDB();
  try {
    const { username, email, password, confpassword } = await req.json();

    const hasSpace = /\s/.test(username);
    if (hasSpace) {
      return NextResponse.json(
        {
          status: false,
          statusCode: 422,
          message: "Username tidak boleh mengandung spasi.",
        },
        { status: 422 },
      );
    }

    const key = crypto.randomBytes(32);
    const existingUser = await checkExistingUser(email, username);
    if (existingUser.status) {
      return NextResponse.json(
        { status: false, statusCode: 422, message: existingUser.message },
        { status: 422 },
      );
    }

    if (password !== confpassword) {
      return NextResponse.json(
        {
          status: false,
          statusCode: 422,
          message: "Password dan Confrim Password tidak sama",
        },
        { status: 422 },
      );
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000);
    const send = await sendEmail({ email, otpCode: otpCode });
    const data = {
      username,
      email,
      password: encriptTs(password, key),
      confpassword: encriptTs(confpassword, key),
    };

    const checkEmail = await veryfiedServices.checkEmail(email);
    let hasil = checkEmail;
    let newpassword = {
      password: password,
      confpassword: confpassword,
    };

    const otpHash = await bcrypt.hash(`${send.codeOTP}`, 10);
    if (!checkEmail) {
      hasil = await veryfiedServices.post({
        ...data,
        codeOtp: otpHash,
      });
      newpassword = {
        password: decrypt(hasil.password, key),
        confpassword: decrypt(hasil.confpassword, key),
      };
    }

    const result = {
      id_register: hasil._id,
      username: hasil.username,
      email: hasil.email,
      password: newpassword.password,
      confpassword: newpassword.confpassword,
      updatedAt: hasil.updatedAt,
    };

    logger.info("Code OTP berhasil di kirim");
    return NextResponse.json(
      {
        status: true,
        statusCode: 200,
        message: "Code OTP berhasil di kirim",
        result,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed create user" + error);
    return NextResponse.json(
      { status: false, statusCode: 500, message: "Failed create user", error },
      { status: 500 },
    );
  }
};

export const PUT = async (req: NextRequest) => {
  try {
    const { id_register, email } = await req.json();

    const otpCode = Math.floor(100000 + Math.random() * 900000);
    const send = await sendEmail({ email, otpCode });
    const otpHash = await bcrypt.hash(String(send.codeOTP), 10);
    const hasil = await veryfiedServices.put(id_register, otpHash);

    const result = {
      id_register: hasil._id,
      username: hasil.username,
      email: hasil.email,
      password: hasil.password,
      confpassword: hasil.confpassword,
    };

    logger.info("Success update OTP code");
    return NextResponse.json(
      {
        status: true,
        statusCode: 200,
        message: "Code OTP berhasil di perbarui",
        result,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed update otp code");
    return NextResponse.json(
      {
        status: false,
        statusCode: 500,
        message: "Failed update otp code",
        error,
      },
      { status: 500 },
    );
  }
};
