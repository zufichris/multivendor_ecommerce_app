import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config({
  path: "/config/.env",
});
const router = express.Router();
const stripe = new Stripe(
  "sk_test_51OBNC9L2NdSsd69QvmBDjqJICAlTwLDEBC0RcowJa7CuloUxVVcO4ylDlkqKmVeHllIAFqTCSPTnfrn09uaieQwZ00PMH4VgUq"
);

export default router;
