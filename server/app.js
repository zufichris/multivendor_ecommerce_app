import express from "express";
import dotenv from "dotenv";
import multer from "multer";
import fs from "fs";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import siteRoutes from "./routes/siteRoutes.js";

import cookieParser from "cookie-parser";
import cors from "cors";
import Stripe from "stripe";
import bodyParser from "body-parser";
import { errorHandler, notfound } from "./middleware/errorHandlers.js";
import productModel from "./models/productModel.js";
const app = express();
app.use(express.json());
app.use("/", express.static("uploads"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({
    path: "config/.env",
  });
}
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/site", siteRoutes);
const stripe = new Stripe(process.env.STRIPE_SECRET);
app.post("/api/stripe/create-checkout-session", cors(), async (req, res) => {
  try {
    const array = req.body;
    const products = [];
    for (let index = 0; index < array.length; index++) {
      const item = array[index];
      const populate = await productModel
        .findById(item.product)
        .select("name description images price");
      item.product = populate;
      products.push(item.product);
    }
    const line_items = array?.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.product.name,
            images: item.product.images,
            description: item.product.description,
            metadata: {
              id: item.product._id,
            },
          },
          unit_amount: item.product.price * 100,
        },
        quantity: item.amount,
      };
    });

    const session = await stripe.checkout.sessions.create({
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "CM", "UA", "NG", "SA"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 0,
              currency: "usd",
            },
            display_name: "Free shipping",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 5,
              },
              maximum: {
                unit: "business_day",
                value: 7,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 1500,
              currency: "usd",
            },
            display_name: "Next day air",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 1,
              },
              maximum: {
                unit: "business_day",
                value: 1,
              },
            },
          },
        },
      ],
      line_items,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/checkout-success`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
    });
    res.send({
      url: session.url,
    });
  } catch (error) {
    res.send({
      error: error,
    });
  }
});
app.get("/uploads/:imagename", (req, res) => {
  const readStream = fs.createReadStream(`uploads/${req.params.imagename}`);
  readStream.pipe(res);
});
app.use(notfound);
app.use(errorHandler);
export default app;
