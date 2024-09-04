import CanvasModels from "../models/canvasModels";

export const canvasSrv = {
  statUpdate: async (canvas_id: string) => {
    return await CanvasModels.findOneAndUpdate(
      { _id: canvas_id },
      { $set: { statUpdate: "Updated" } },
    );
  },
  getByIdCanvas: async (canvas_id: string) => {
    return await CanvasModels.findOne({ _id: canvas_id });
  },
  addAudio: async (canvas_id: string, audio: { public_id: string; audioUrl: string }) => {
    return await CanvasModels.findOneAndUpdate({ _id: canvas_id }, { $set: { audio: audio } });
  },
};
