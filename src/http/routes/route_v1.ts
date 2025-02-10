import express from "express";
import AuthRoutes from "./auth";
import UserRoutes from "./user";
import LoggedInUserRoutes from "./me"
import VendorRoutes from "./vendor"
import ProductRoutes from "./product"
import OrderRoutes from "./order"
import Payment from "./payment"
import PaymentMethodRoutes from "./payment-method"
import ShippingRoutes from "./shipping"


const router = express.Router();

router.get("/", (_, res) => {
  res.json({
    message: "Welcome to VendorVerse API",
    documentation: "/api/v1/docs",
  });
});
router.use("/auth", AuthRoutes);
router.use("/users", UserRoutes);
router.use("/me", LoggedInUserRoutes)
router.use("/vendors", VendorRoutes)
router.use("/products", ProductRoutes)
router.use("/orders", OrderRoutes)
router.use("/shipping", ShippingRoutes)
router.use("/payments", Payment)
router.use("/payment-methods", PaymentMethodRoutes)

export default router;
