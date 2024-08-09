/* eslint-disable no-unused-vars */

export interface MisiContextType {
  addMisiUser: (user_id: string, mission_id: string, type: string) => void;
  claimMisi: (misiUserId: string, point: number) => void;
  msgPoint: { msg: number; status: boolean };
}
