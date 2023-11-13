import express from "express";
import {
  searchBrand,
  searchCategory,
} from "../controllers/categoryControllers.js";
import { authMiddleware, isAdmin } from "../middleware/authMiddleware.js";
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getFeatured,
  getProduct,
  updateProduct,
  addToCart,
  addToWishlist,
  addToFeature,
  deleteFromCart,
} from "../controllers/productControllers.js";
import { uploadOptions } from "../multer.js";
import { searchProducts } from "../controllers/filters.js";

const router = express.Router();
//products
router.post(
  "/create-product",
  uploadOptions.single("image"),

  authMiddleware,
  isAdmin,
  createProduct
);
router.get("/all-products", authMiddleware, isAdmin, getAllProduct);
router.get("/get-product/:productId", getProduct);
router.get("/featured/:limit", getFeatured);
router.put(
  "/:productId",

  // authMiddleware,
  // isAdmin,
  uploadOptions.array("images"),
  updateProduct
);
router.delete("/:productId", authMiddleware, isAdmin, deleteProduct);
router.post(
  "/set-product-feature/:productId",
  authMiddleware,
  isAdmin,
  addToFeature
);
//filters
router.get("/search/:name", searchProducts);

//categories
router.get("/filter-category/:category", searchCategory);
router.get("/filter-brand/:brand", searchBrand);
//cart
router.post("/add-to-cart/:productId", authMiddleware, addToCart);

//wishlist
router.post("/add-to-wishlist/:productId", authMiddleware, addToWishlist);
export default router;
