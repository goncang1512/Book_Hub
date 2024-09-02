export const pesanVar = {
  cardBook: ({ imgUser, title, username, jenis, book_id }: any) => {
    return `
        <div
        style="display: flex; justify-content: start; align-items: top; gap: 5px"
        >
            <img
                draggable="false"
                src="${imgUser}"
                alt=""
                style="
                width: 88px;
                height: 144px;
                border-radius: 0.5rem;
                object-fit: cover;
                "
            />
            <div style="display: flex; flex-direction: column; line-height: 20px">
                <a
                    href="${jenis === "Novel" ? `/read/${book_id}` : `/content/${book_id}`}"
                    target="_blank"
                    style="
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        width: 88px;
                        height: max-content;
                        text-decoration: none;
                        font-weight: 600;
                    "
                    >
                    ${title}
                </a>
                <a
                href="/user/@${username}"
                target="_blank"
                style="height: max-content; width: 88px; text-decoration: none;  color: blue;"
                >${username}</a
                >
            </div>
        </div>
        `;
  },
  storyCard: ({
    username,
    story,
    link_id,
  }: {
    username: string;
    story: string;
    link_id: string;
  }) => {
    let result = `
        <div style="display: flex; flex-direction: column; justif-content: start;">
            <a
                href="/user/@${username}"
                target="_blank"
                style="height: max-content; width: 88px; text-decoration: none;  color: blue; font-weight: 600;"
            >${username}</a>
            <a
                href="/content?id=${link_id}"
                target="_blank"
                style="height: max-content; width: 88px; text-decoration: none;  color: blue;"
            >See More</a>
        </div>
         ##
        ${story}
    `;

    return result;
  },
};
