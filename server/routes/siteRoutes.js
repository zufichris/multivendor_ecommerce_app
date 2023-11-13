import express from "express";
import { authMiddleware, isAdmin } from "../middleware/authMiddleware.js";
import {
  createNotification,
  deleteNotification,
  siteData,
  siteVisits,
} from "../controllers/siteControllers.js";
import { uploadOptions } from "../multer.js";
const router = express.Router();
router.post(
  "/create-notification",

  authMiddleware,
  isAdmin,
  uploadOptions.single("image"),
  createNotification
);
router.get("/site-data", authMiddleware, isAdmin, siteData);
router.post("/increase-visits", siteVisits);
router.delete(
  "/delete-notification/:notificationId",
  // authMiddleware,
  // isAdmin,
  deleteNotification
);
export default router;
