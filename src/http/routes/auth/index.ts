import express from "express";
import { authControllers } from "../../controllers/auth";

const router = express.Router();

router.post("/", (req, res, next) => authControllers.register(req, res, next));
router.post("/login", (req, res) => authControllers.login(req, res));
router.get("/logout", (req, res) => authControllers.logout(req, res));

router.get("/google", (_, res) => authControllers.googleAuth.authRequest(res));
router.get(
  "/google/callback",
  (req, res, next) => authControllers.googleAuth.getTokens(req, res, next),
  (req, res, next) => authControllers.googleAuth.getUserProfile(req, res, next),
  (req, res) => authControllers.socialLogin(req, res)
);
export default router;
