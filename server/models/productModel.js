import mongoose from "mongoose";
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    brand: {
      type: String,
      required: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,

      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const productModel = mongoose.model("products", productSchema);
export default productModel;
