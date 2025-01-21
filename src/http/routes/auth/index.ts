import express from "express";
import { authControllers } from "../../controllers/auth";
import { authMiddleWare } from "../../middleware/auth";
const router = express.Router();
router.post("/", authControllers.signUp);
router.post("/login", authControllers.signIn);
router.get("/logout", authMiddleWare.requireAuth, authControllers.signOut);
router.get("/google", authControllers.googleAuthControllers.authRequest);

router.get("/google/callback",
  authControllers.googleAuthControllers.getGoogleTokens,
  authControllers.googleAuthControllers.getUserProfile,
  authControllers.socialSignIn
);

export default router;
