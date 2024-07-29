import CanvasModels from "../models/canvasModels";

export const canvasSrv = {
  statUpdate: async (canvas_id: string) => {
    return await CanvasModels.findOneAndUpdate(
      { _id: canvas_id },
      { $set: { statUpdate: "Updated" } },
    );
  },
};
