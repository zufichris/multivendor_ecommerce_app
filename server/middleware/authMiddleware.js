import jwt from "jsonwebtoken";
import userModel from "../models/UserModel.js";
import mongoose from "mongoose";
export const authMiddleware = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throw new Error("Unauthorized, no token");
      return;
    }
    if (req.headers.authorization.startsWith("Bearer")) {
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        throw new Error("Invalid token");
        return;
      }
      const { userId } = jwt.verify(token, process.env.JWT);
      if (!userId) {
        throw new Error("Invali token");
        return;
      }
      req.params.userId = userId;
      next();
    }
  } catch (error) {
    next(error);
  }
};
export const isAdmin = async (req, res, next) => {
  const { userId } = req.params;
  try {
    if (!mongoose.isValidObjectId(userId)) {
      throw new Error("validation failed::Invalid user ID");
    }
    const user = await userModel.findById(userId);
    if (!user) {
      throw new Error("Invalid user");
    }

    if (!user.isAdmin) {
      throw new Error("unauthorized, you are not admin");
    }
    next();
  } catch (error) {
    next(error);
  }
};
