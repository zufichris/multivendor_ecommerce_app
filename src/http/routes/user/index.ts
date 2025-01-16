import express from "express";
import { userControllers } from "../../controllers/user";

const router = express.Router();
router
  .route("/")
  .post((req, res, next) => userControllers.createUser(req, res))
  .get((req, res) => userControllers.queryUsers(req, res));

export default router;
