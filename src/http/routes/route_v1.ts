import express from "express";
import AuthRoutes from "./auth";
import UserRoutes from "./user";
import LoggedInUserRoutes from "./me"
import VendorRoutes from "./vendor"
import ProductRoutes from "./product"

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
router.use("/product", ProductRoutes)

export default router;
