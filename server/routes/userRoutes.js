import express from "express";
import {
  verify,
  register,
  login,
  getAllUsers,
  getUserById,
  getCart,
  getWishlist,
  deleteUser,
  getNotifications,
} from "../controllers/userControllers.js";

import { authMiddleware, isAdmin } from "../middleware/authMiddleware.js";
import { uploadOptions } from "../multer.js";
import { deleteFromCart } from "../controllers/productControllers.js";

const router = express.Router();
//auth
router.post("/register", uploadOptions.single("avatar"), register);
router.get("/verify/:token", verify);
router.post("/login", login);
router.get("/all-users", authMiddleware, isAdmin, getAllUsers);
router.get("/getuserbyId", authMiddleware, getUserById);
router.delete("/delete-user/:password", authMiddleware, deleteUser);
//cart
router.get("/cart", authMiddleware, getCart);
router.delete("/delete-from-cart/:productId", authMiddleware, deleteFromCart);
//wishlist
router.get("/wishlist", authMiddleware, getWishlist);
//notifications
router.get("/notifications", authMiddleware, getNotifications);
export default router;
