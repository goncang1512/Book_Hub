import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { dasboardServices } from "@/lib/services/dasboard";
import { logger } from "@/lib/utils/logger";
import { msgServices } from "@/lib/services/message";
import UserModels from "@/lib/models/users";

export const PATCH = async (req: NextRequest) => {
  try {
    const { user_id, role } = await req.json();
    const accessToken = req.headers.get("authorization")?.split(" ")[1];
    const user = await UserModels.findOne({ _id: user_id });

    let pesan: string;
    if (role === "Author") {
      pesan = `
        <p><strong>Halo ${user?.username},</strong></p>
        <p><br></p>
        <p>Kami dengan senang hati menginformasikan bahwa peran Anda di BookHub telah berhasil diubah menjadi Author. Dengan peran baru ini, Anda sekarang memiliki kemampuan untuk:</p>
        <p><br></p>
        <p>&bull; Menulis dan mempublikasikan novel atau cerpen.&nbsp;</p>
        <p>&bull; Mengedit dan memperbarui karya-karya yang sudah Anda tulis.&nbsp;</p>
        <p>&bull; Mengelola buku-buku yang sudah Anda publikasikan, termasuk revisi dan perbaikan.&nbsp;</p>
        <p><br></p>
        <p>Kami berharap Anda dapat memanfaatkan peran baru ini untuk berbagi kreativitas dan inspirasi melalui karya-karya Anda. Jika Anda memiliki pertanyaan atau memerlukan bantuan, jangan ragu untuk menghubungi tim dukungan kami.&nbsp;</p>
        <p><br></p>
        <p>Selamat menulis dan berkarya!&nbsp;</p>
        <p><br></p>
        <p>Salam, Tim BookHub</p>
      `;
    } else if (role === "Reguler") {
      pesan = `
        <p><strong>Halo ${user?.username},</strong></p>
        <p><br></p>
        <p>Kami ingin memberi tahu Anda bahwa peran Anda di BookHub telah diubah dari Author menjadi Reguler. Dengan peran baru ini, Anda sekarang memiliki kemampuan untuk:</p>
        <p><br></p>
        <p>&bull; Membaca berbagai karya yang dibuat oleh para author di platform kami.&nbsp;</p>
        <p>&bull; Memberikan reaksi, seperti suka, komentar, atau ulasan, pada karya-karya tersebut.&nbsp;</p>
        <p><br></p>
        <p>Perubahan ini berarti Anda tidak lagi memiliki akses untuk menulis atau mengelola konten di platform ini. Kami menghargai kontribusi Anda sebelumnya sebagai author dan berharap Anda tetap menikmati karya-karya yang ada di platform kami.&nbsp;</p>
        <p><br></p>
        <p>Jika Anda memiliki pertanyaan atau memerlukan bantuan, jangan ragu untuk menghubungi tim dukungan kami.&nbsp;</p>
        <p><br></p>
        <p>Terima kasih atas pengertian Anda.</p>
        <p><br></p>
        <p>Salam, Tim BookHub</p>
      `;
    } else if (role === "Developer") {
      pesan = `
      <p id="isPasted"><strong>Halo ${user?.username},</strong></p>
      <p>Kami ingin memberi tahu Anda bahwa role Anda di Website BookHub telah diubah menjadi <strong>Developer</strong>. Dengan role baru ini, Anda memiliki beberapa kemampuan baru yang penting, termasuk:</p>
      <p><br></p>
      <ul>
      <li>&bull; Memeriksa dan merilis chapter baru dari buku.</li>
      <li id="isPasted">&bull; Memberikan badge pada pengguna yang layak mendapatkannya.</li>
      <li id="isPasted">&bull; Mengubah role pengguna lain.</li>
      <li id="isPasted">&bull; Memantau aktivitas dan konten yang diterbitkan di platform.</li>
      <li id="isPasted"><br></li>
      </ul>
      <p>Terima kasih atas kontribusi Anda yang berharga di BookHub. Kami yakin Anda akan terus membantu komunitas kami berkembang dan memberikan pengalaman terbaik bagi semua pengguna.</p>
      <p><br></p>
      <p>Jika Anda memiliki pertanyaan atau memerlukan bantuan lebih lanjut, jangan ragu untuk menghubungi tim dukungan kami.</p>
      <p><br></p>
      <p>Salam, Tim BookHub</p>
      `;
    }

    return new Promise<void | Response>((resolve) => {
      jwt.verify(
        accessToken || "",
        process.env.NEXTAUTH_SECRET || "",
        async (error: any, encoded: any) => {
          if (encoded && encoded?.role === "Developer") {
            const result = await dasboardServices.pathcRole(user_id, role);
            await msgServices.post({
              senderId: encoded._id,
              recipientId: user_id,
              message: pesan,
              type: "message",
            });

            logger.info("Success update role user");
            resolve(
              NextResponse.json(
                {
                  status: true,
                  statusCode: 200,
                  message: "Success update role user",
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
    logger.error("Failed update role user");
    return NextResponse.json(
      {
        status: false,
        statusCode: 500,
        message: "Failed update role user",
        error,
      },
      { status: 500 },
    );
  }
};

export const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const searhcParams = new URLSearchParams(url.searchParams);
    const valueSearch = searhcParams.get("keyword");

    const result = await dasboardServices.searchUser(valueSearch);
    if (result.length === 0) {
      logger.error(`User "${valueSearch}" tidak ada.`);
      return NextResponse.json(
        {
          status: false,
          statusCode: 422,
          message: `User "${valueSearch}" tidak ada.`,
        },
        { status: 422 },
      );
    }

    logger.info("Success search username or email user");
    return NextResponse.json(
      {
        status: true,
        statusCode: 200,
        message: "Success search username or email user",
        result,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    logger.error("Failed search username or email user");
    return NextResponse.json(
      {
        status: false,
        statusCode: 500,
        message: "Failed search username or email user",
        error,
      },
      { status: 500 },
    );
  }
};
