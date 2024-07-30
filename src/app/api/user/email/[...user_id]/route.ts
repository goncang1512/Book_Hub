import { sendEmail } from "@/lib/middleware/mailer";
import { userSevices, veryfiedServices } from "@/lib/services/userservices";
import { logger } from "@/lib/utils/logger";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, { params }: { params: { user_id: string[] } }) => {
  try {
    const { oldEmail, newEmail } = await req.json();

    const emailExisting = await userSevices.existingEmail(newEmail, params.user_id[0]);
    if (emailExisting) {
      return NextResponse.json(
        { status: false, statusCode: 422, message: "Email sudah terdaftar" },
        { status: 422 },
      );
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000);
    await sendEmail({ email: oldEmail, otpCode });

    const data = {
      username: oldEmail,
      email: newEmail,
      password: "",
      confpassword: "",
      codeOtp: otpCode,
    };

    await veryfiedServices.post(data);

    logger.info("Success send email");
    return NextResponse.json(
      { status: true, statusCode: 200, message: "Success send email" },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed send email" + error);
    return NextResponse.json(
      { status: false, statusCode: 500, message: "Failed send email", error },
      { status: 500 },
    );
  }
};

export const PATCH = async (req: NextRequest, { params }: { params: { user_id: string[] } }) => {
  try {
    const { codeOtp } = await req.json();

    const checkotp = await veryfiedServices.checkEmailExit(Number(codeOtp));
    if (!checkotp) {
      return NextResponse.json(
        { status: false, statusCode: 422, message: "Wrong code OTP" },
        { status: 422 },
      );
    }

    const result = await userSevices.updateEmail(checkotp.email, params.user_id[0]);
    await veryfiedServices.deleteVerified(checkotp.email);

    logger.info("Success updated email");
    return NextResponse.json(
      { status: true, statusCode: 200, message: "Success updated email", result },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed updated email");
    return NextResponse.json(
      { status: false, statusCode: 500, message: "Failed updated email", error },
      { status: 500 },
    );
  }
};
