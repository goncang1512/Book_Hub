import { NextRequest, NextResponse } from "next/server";

import { logger } from "@/lib/utils/logger";
import { checkFotoProfil as checkFotoCover } from "@/lib/middleware/checkUser";
import { uploadCover } from "@/lib/middleware/uploadImg";
import connectMongoDB from "@/lib/config/connectMongoDb";
import BooksModels from "@/lib/models/booksModels";
import { bookAutServices } from "@/lib/services/bookauthor";
import { bookServ, bookServices } from "@/lib/services/bookservices";
import { getListBook } from "@/lib/middleware/likechek";

export const POST = async (req: NextRequest) => {
  await connectMongoDB();
  try {
    const { title, writer, sinopsis, terbit, imgBooks, user_id, ISBN, genre, jenis } =
      await req.json();

    const book = await BooksModels.findOne({
      title: new RegExp(`^${title}$`, "i"),
      writer: new RegExp(`^${writer}$`, "i"),
      ISBN,
    });
    if (book) {
      return NextResponse.json(
        { status: false, statusCode: 422, message: "Buku sudah terdaftar" },
        { status: 422 },
      );
    }

    const hasil = await checkFotoCover(imgBooks);
    if (hasil.condition) {
      logger.error(`${hasil.message}`);
      return NextResponse.json(
        { status: false, statusCode: 422, message: hasil.message },
        { status: 422 },
      );
    }

    const cover: any = await uploadCover(imgBooks);
    const data = {
      title,
      writer,
      user_id,
      sinopsis,
      terbit,
      ISBN,
      genre,
      jenis,
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

    let statusBook: any[] = [];

    if (results.length > 0) {
      for (let result of results) {
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

    const hasil = await getListBook(results);
    const newRecomended = await getListBook(recomended);

    logger.info("Success get all book");
    return NextResponse.json(
      {
        status: true,
        statusCode: 200,
        message: "Success get all books",
        result: hasil,
        recomended: newRecomended,
        statusBook,
        jenisHot,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Gagal ambil semua buku" + error);
    return NextResponse.json(
      { status: false, statusCode: 500, message: "Failed get all book" },
      { status: 500 },
    );
  }
};
