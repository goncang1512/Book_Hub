import nodemailer from "nodemailer";

export const sendEmail = async ({
  email,
  otpCode: codeOtp,
}: {
  email: string;
  otpCode: Number;
}) => {
  try {
    var transport = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.EMAIL_USER || "",
        pass: process.env.PASS_MAILER || "",
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Kode OTP Anda",
      text: `Your code \n${codeOtp}`,
      html: `
      <div style="width: 100%; height: 100%; background-color: #fff; padding: 50px 0;">
          <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.1);">
              <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif; color: #333;">
                  <h2 style="margin-bottom: 20px; color: #4CAF50;">Kode OTP Anda</h2>
                  <p style="font-size: 18px; margin-bottom: 30px;">Gunakan kode berikut untuk melanjutkan:</p>
                  <div style="font-size: 36px; font-weight: bold; margin: 20px 0; padding: 10px 20px; background: #f4f4f4; border-radius: 5px; display: inline-block;">
                      ${codeOtp}
                  </div>
                  <p style="font-size: 16px; color: #777;">Jika Anda tidak meminta kode ini, abaikan email ini.</p>
                  <div style="margin-top: 30px;">
                      <p style="font-size: 16px; color: #777;">Terima kasih,</p>
                      <p style="font-size: 16px; color: #777;">Literacy Lumeniracy</p>
                  </div>
              </div>
          </div>
      </div>
  `,
    };

    const mailresponse = await transport.sendMail(mailOptions);
    return { ...mailresponse, codeOTP: codeOtp };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const sendMsgNewSession = async (email: string, level: number) => {
  try {
    var transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.PASS_MAILER,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "New Season",
      text: `Season Telah Berakhir dan level akan di turun ke level ${level}`,
    };

    const mailresponse = await transport.sendMail(mailOptions);
    return mailresponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const sendMsgRole = async (email: string, role: string) => {
  try {
    let transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.PASS_MAILER,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Role anda telah di ubah",
      text: `Role anda telah di ubah jadi ${role}`,
      html: `
      <div style="width: 100%; height: 100%; background-color: #fff; padding: 50px 0;">
          <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.1);">
              <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif; color: #333;">
                  <h2 style="margin-bottom: 20px; color: #4CAF50;">Role Baru</h2>
                  <p style="font-size: 18px; margin-bottom: 30px;">Role baru anda:</p>
                  <div style="font-size: 36px; font-weight: bold; margin: 20px 0; padding: 10px 20px; background: #f4f4f4; border-radius: 5px; display: inline-block;">
                      ${role}
                  </div>
                  <p style="font-size: 16px; color: #777;">Lakukan login ulang untuk menggunakan role</p>
                  <div style="margin-top: 30px;">
                      <p style="font-size: 16px; color: #777;">Terima kasih,</p>
                      <p style="font-size: 16px; color: #777;">Literacy Lumeniracy</p>
                  </div>
              </div>
          </div>
      </div>
  `,
    };

    const mailresponse = await transport.sendMail(mailOptions);
    return mailresponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
