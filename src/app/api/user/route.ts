import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import connectMongoDB from "@/lib/config/connectMongoDb";
import { logger } from "@/lib/utils/logger";
import UserModels from "@/lib/models/users";
import { msgServices } from "@/lib/services/message";
import { userSevices, veryfiedServices } from "@/lib/services/userservices";
import { bookServices } from "@/lib/services/bookservices";
import { getBalasan, getLikeContent, getListBook } from "@/lib/middleware/likechek";
import { bookAutServices } from "@/lib/services/bookauthor";
import { storyServices } from "@/lib/services/storyservices";
import { followServices } from "@/lib/services/followservices";

export const POST = async (req: NextRequest) => {
  try {
    await connectMongoDB();
    const { username, email, password, codeOtp, id_register } = await req.json();
    const veryfied = await veryfiedServices.get(id_register);
    if (veryfied.codeOtp !== Number(codeOtp) || !veryfied.codeOtp) {
      return NextResponse.json(
        { status: false, statusCode: 422, message: "Kode OTP salah" },
        { status: 422 },
      );
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const data = {
      user_id: uuidv4(),
      username,
      email,
      password: hashPassword,
      role: "Reguler",
      number: "",
      alamat: "",
      imgProfil: {
        public_id: "profil/ptkdih6zbetqjfddpqhf",
        imgUrl:
          "https://res.cloudinary.com/dykunvz4p/image/upload/c_fill,h_130,w_130/profil/ptkdih6zbetqjfddpqhf.jpg",
      },
      rank: {
        level: 1,
        experience: 0,
        rankNow: "/rank-satu.png",
        rankTertinggi: {
          no: 1,
          img: "/rank-satu.png",
        },
      },
      profileGround: {
        public_id: "default_id",
        urlLatar: "/new-cover-profil.png",
      },
      status: "aktif",
    };

    const result = await userSevices.post(data);
    await veryfiedServices.delete(id_register);

    logger.info("Success create user");
    return NextResponse.json(
      {
        status: true,
        statusCode: 201,
        message: "Success create user",
        result,
      },
      { status: 201 },
    );
  } catch (error) {
    logger.error("Failed create user" + error);
    return NextResponse.json(
      { status: false, statusCode: 500, message: "Failed create user", error },
      { status: 500 },
    );
  }
};

export const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const username: string | null = searchParams.get("user_id");

    const result = await UserModels.findOne(
      { username },
      "_id username email imgProfil rank role createdAt badge profileGround",
    );

    let statusBook: any[] = [];
    const books = await bookServices.byId(result._id);
    const listBook = await getListBook(books);

    if (listBook && listBook.length > 0) {
      for (let result of listBook) {
        if (result.jenis === "Cerpen") {
          const canvas = await bookAutServices.getCerpen(result._id);
          if (canvas.length > 0) {
            canvas.forEach((item) => {
              statusBook.push({
                _id: item._id,
                book_id: item.book_id,
                status: item.status,
              });
            });
          } else {
            statusBook.push({ _id: null, book_id: result._id, status: null });
          }
        }
      }
    }

    const cerita = await storyServices.getStoryUser(result._id);
    const storys = await getLikeContent(cerita);

    const getMengikuti = await followServices.getMengikuti(result._id);
    const diikuti = await followServices.getDiikuti(result._id);
    const userWithFollower = { ...result.toObject(), follower: getMengikuti, myFollower: diikuti };
    const storyWithBalasan = await getBalasan(storys);

    logger.info("Success get user");
    return NextResponse.json(
      {
        status: true,
        statusCode: 200,
        message: "Success get user",
        result: userWithFollower,
        books: listBook,
        storys: storyWithBalasan,
        statusBook,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed get user");
    return NextResponse.json(
      { status: false, statusCode: 500, message: "Failed get user", error },
      { status: 500 },
    );
  }
};

export const PATCH = async (req: NextRequest) => {
  try {
    const accessToken = req.headers.get("authorization")?.split(" ")[1];

    return new Promise<void | Response>((resolve) => {
      jwt.verify(
        accessToken || "",
        process.env.NEXTAUTH_SECRET || "",
        async (error: any, encoded: any) => {
          if (encoded && encoded.role === "Developer") {
            const users = await userSevices.get();
            let result: any[] = [];

            for (const user of users) {
              let rank = {
                level: 0,
                rankNow: "",
              };

              let level: { lvl: number; tier: string } = {
                lvl: 0,
                tier: "",
              };
              if (user.rank.level <= 4) {
                rank = {
                  level: user.rank.level - 1,
                  rankNow: "/rank-satu.png",
                };
                level = {
                  lvl: user.rank.level - 1,
                  tier: "Read Master",
                };
              } else if (user.rank.level >= 5 && user.rank.level <= 12) {
                rank = {
                  level: 5,
                  rankNow: "/rank-dua.png",
                };
                level = {
                  lvl: 5,
                  tier: "Read GM",
                };
              } else if (user.rank.level > 12) {
                rank = {
                  level: 8,
                  rankNow: "/rank-dua.png",
                };
                level = {
                  lvl: 8,
                  tier: "Read GM",
                };
              }

              const hasil = await userSevices.newSession(user._id, rank.level, rank.rankNow);

              const pesan = `
                Halo BookHubers,
                \n
                Kami dengan gembira mengumumkan bahwa season baru di BookHub akan segera dimulai! Seiring dengan dimulainya season baru ini, kamu akan mengalami penurunan tier ke ${level.tier} dengan level ${level.lvl}. Berikut adalah beberapa informasi penting terkait perubahan ini:
                \n
                • Penurunan Tier: Semua tier pengguna akan direset ke tingkat yang lebih rendah untuk memberikan tantangan baru dan peluang bagi semua pengguna untuk bersaing di season yang baru.
                • Peluang Baru: Season baru ini menghadirkan kesempatan bagi Anda untuk meraih kembali tier tinggi dengan lebih banyak hadiah dan penghargaan yang menarik.
                • Fitur dan Konten Baru: Kami juga telah menambahkan beberapa fitur dan konten baru yang akan membuat pengalaman Anda semakin seru dan menarik.
                \n
                Kami berharap perubahan ini akan memberikan pengalaman yang lebih menyegarkan dan kompetitif bagi semua pengguna. Jika Anda memiliki pertanyaan atau membutuhkan bantuan, tim dukungan kami siap membantu.
                \n
                Selamat berkompetisi dan semoga berhasil di season baru ini!
                \n
                Salam,
                Tim BookHub`;

              await msgServices.post({
                senderId: encoded._id,
                recipientId: user._id,
                message: pesan,
                type: "message",
              });

              result.push(hasil);
            }

            logger.info("Success update all user");
            resolve(
              NextResponse.json(
                {
                  status: true,
                  statusCode: 200,
                  message: "Success update all user",
                  result,
                },
                { status: 200 },
              ),
            );
          } else {
            logger.error("Unauthorized" + error);
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
    logger.error("Failed update all user");
    return NextResponse.json(
      {
        status: false,
        statusCode: 500,
        message: "Failed update all user",
        error,
      },
      { status: 500 },
    );
  }
};
