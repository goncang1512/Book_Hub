import { userSevices } from "../services/userservices";

type RankUser = {
  level: number;
  experience: number;
  rankNow: string;
  rankTertinggi: {
    img: string;
    no: number;
  };
};

export class naikPeringkat {
  rankuser: RankUser;
  constructor(rankUser: RankUser) {
    this.rankuser = rankUser;
  }

  checkLevel = () => {
    let img;
    let rankTinggi = {
      img: this.rankuser.rankTertinggi.img,
      no: this.rankuser.rankTertinggi.no,
    };

    if (this.rankuser.level <= 4) {
      img = "/rank-satu.png";
      if (this.rankuser.level > this.rankuser.level) {
        rankTinggi = {
          img: "/rank-satu.png",
          no: this.rankuser.level,
        };
      }
    } else if (this.rankuser.level >= 5 && this.rankuser.level <= 8) {
      img = "/rank-dua.png";
      if (this.rankuser.level > this.rankuser.level) {
        rankTinggi = {
          img: "/rank-dua.png",
          no: this.rankuser.level,
        };
      }
    } else if (this.rankuser.level >= 9 && this.rankuser.level <= 12) {
      img = "/rank-tiga.png";
      if (this.rankuser.level > this.rankuser.level) {
        rankTinggi = {
          img: "/rank-tiga.png",
          no: this.rankuser.level,
        };
      }
    } else if (this.rankuser.level > 12) {
      img = "/rank-empat.png";
      if (this.rankuser.level > this.rankuser.level) {
        rankTinggi = {
          img: "/rank-empat.png",
          no: this.rankuser.level,
        };
      }
    }

    return {
      img,
      rankTinggi,
    };
  };

  updateData = async (
    user_id: string,
    img: string | undefined,
    rankTinggi: { img: string; no: number },
  ) => {
    const myRank = await userSevices.updateRank(user_id, img && img);
    const highRank = await userSevices.updateRankTertinggi(user_id, rankTinggi);

    return {
      myRank,
      highRank,
    };
  };
}
