import { msgServices } from "../services/message";
import { whislistSrv } from "../services/whilistservices";

export const newChapterBook = async (book_id: string, senderId: string, canvas: any, book: any) => {
  const whislist = await whislistSrv.getOne(book_id);

  for (const list of whislist) {
    let message = `
        <p id="isPasted"><strong>Halo ${list.user?.username},</strong></p>
        <p><br></p>
        <p>Kabar gembira! Bab baru dari buku &quot;${list?.book?.title}&quot; yang kamu simpan telah dirilis. Jangan lewatkan kelanjutan ceritanya dan segera baca bab terbaru sekarang!</p>
        <p><br></p>
        <p>Klik di sini untuk membaca: 
        <a style="color: blue;" href=${book.jenis === "Novel" ? `/read/${book_id}` : `/read?id=${book_id}&chapter=${canvas._id}`}>${canvas?.judul}</a>
        </p>
        <p><br></p><p>Selamat membaca!</p>
        <p><br></p>
        <p>Salam,&nbsp;</p>
        <p>Tim BookHub</p>
        `;
    await msgServices.post({ senderId, recipientId: list.user_id, message });
  }
};
