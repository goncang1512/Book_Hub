import { bookAutServices } from "@/lib/services/bookauthor";
import { ResultsBook } from "@/lib/utils/types/booktypes.type";

export const getStatusBook = async (results: ResultsBook[]) => {
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

  return statusBook;
};
