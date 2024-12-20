import { NextRequest, NextResponse } from "next/server";

import { logger } from "@/lib/utils/logger";
import { checkFotoProfil as checkFotoCover } from "@/lib/middleware/checkUser";
import { uploadCover } from "@/lib/middleware/uploadImg";
import connectMongoDB from "@/lib/config/connectMongoDb";
import BooksModels from "@/lib/models/booksModels";
import { bookServ, bookServices } from "@/lib/services/bookservices";
import { getListBook, processBooks } from "@/lib/middleware/likechek";
import { ReqCreateBook, UpBookType } from "@/lib/utils/types/booktypes.type";

export const POST = async (req: NextRequest) => {
  await connectMongoDB();
  try {
    const body: ReqCreateBook = await req.json();

    const book = await BooksModels.findOne({
      title: new RegExp(`^${body.title}$`, "i"),
      writer: new RegExp(`^${body.writer}$`, "i"),
      ISBN: body.ISBN,
    });
    if (book) {
      return NextResponse.json(
        { status: false, statusCode: 422, message: "Buku sudah terdaftar" },
        { status: 422 },
      );
    }

    const hasil = await checkFotoCover(body.imgBooks);
    if (hasil.condition) {
      logger.error(`${hasil.message}`);
      return NextResponse.json(
        { status: false, statusCode: 422, message: hasil.message },
        { status: 422 },
      );
    }

    const cover: any = await uploadCover(body.imgBooks);
    const data: UpBookType = {
      ...body,
      terbit: new Date(body.terbit),
      user: body.user_id,
      imgBooks: {
        public_id: cover.public_id,
        imgUrl: cover.secure_url,
      },
    };

    const result = await bookServices.upload(data);

    logger.info("Success upload book");
    return NextResponse.json(
      {
        status: true,
        statusCode: 201,
        message: "Success upload book",
        result,
      },
      { status: 201 },
    );
  } catch (error) {
    logger.error("Gagal upload buku" + error);
    return NextResponse.json(
      { status: false, statusCode: 500, message: "Failed post book" },
      { status: 500 },
    );
  }
};

export const GET = async () => {
  await connectMongoDB();

  try {
    const results = await bookServices.getAll();
    const statusBookResults = await processBooks(results);

    let statusBook = [...statusBookResults];

    let recomended = [];
    let filterBooks = [];
    for (const hasil of results) {
      if (hasil.jenis !== "Review") {
        const sum = await bookServ.recomended(hasil);
        recomended.push(sum);
        filterBooks.push(sum);
      } else if (hasil.jenis === "Review") {
        const sum = await bookServ.jenisTrending(hasil);
        filterBooks.push(sum);
      }
    }

    const filterMap: { [key: string]: any[] } = {
      Novel: [],
      Cerpen: [],
      Review: [],
    };

    for (const filter of filterBooks) {
      const { jenis } = filter;
      if (filterMap[jenis]) {
        filterMap[jenis].push(filter);
      }
    }

    const jenisHot: { type: string; data: any[] }[] = Object.keys(filterMap)
      .map((jenis) => {
        const filteredData = filterMap[jenis];
        if (filteredData.length > 0) {
          filteredData.sort((a: any, b: any) => b.sumReaders - a.sumReaders);
          const topThreeData = filteredData.slice(0, 3);
          return { type: jenis, data: topThreeData };
        }
        return null;
      })
      .filter((item): item is { type: string; data: any[] } => item !== null);

    recomended.sort((a, b) => b.sumReaders - a.sumReaders);

    const newRecomended = await getListBook(recomended);

    logger.info("Success get all book");
    return NextResponse.json(
      {
        status: true,
        statusCode: 200,
        message: "Success get all books",
        recomended: newRecomended,
        totalPage: results.length,
        statusBook,
        jenisHot,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Gagal ambil semua buku" + error);
    return NextResponse.json(
      { status: false, statusCode: 500, message: "Failed get all book", error },
      { status: 500 },
    );
  }
};
