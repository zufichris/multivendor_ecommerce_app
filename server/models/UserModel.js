import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "51e703ed7d1aa57f01514483d4bd5585",
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verifyToken: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    cart: {
      cartItems: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products",
          },
          amount: {
            type: Number,
            default: 0,
          },
          price: {
            type: Number,
            default: 0,
          },
        },
      ],
      totalAmount: {
        type: Number,
        default: 0,
      },
      totalPrice: {
        type: Number,
        default: 0,
      },
    },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "products" }],
    notifications: [
      {
        image: {
          type: String,
        },
        content: {
          type: String,
          required: true,
        },
      },
    ],
    blocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, strict: false }
);

const userModel = new mongoose.model("users", userSchema);
export default userModel;
