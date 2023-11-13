import mongoose from "mongoose";

const seriesScema = new mongoose.Schema({
  name: {
    type: String,
  },
  season: {
    type: Number,
  },
  videos: [
    {
      episode: {
        type: String,
      },
      url: {
        type: String,
      },
    },
  ],
});
const seriesModel = mongoose.model("series", seriesScema);
export default seriesModel;
