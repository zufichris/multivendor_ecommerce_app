import mongoose from "mongoose";
const getDate = () => {
  const date = new Date();
  return date;
};
const siteSchema = new mongoose.Schema(
  {
    visits: {
      type: Number,
      default: 0,
    },
    notifications: [
      {
        image: {
          type: String,
        },
        content: {
          type: String,
        },
        createdAt: {
          type: String,
          default: getDate(),
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
const siteModel = mongoose.model("site", siteSchema);
export default siteModel;
