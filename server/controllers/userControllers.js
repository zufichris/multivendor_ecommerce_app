import userModel from "../models/UserModel.js";
import tokenModel from "../models/tokenModel.js";
import jwt from "jsonwebtoken";
import fs from "fs";

import bcrypt from "bcrypt";
import verifymail from "../utils/Mailer.js";
import generateToken from "../utils/generateToken.js";
import siteModel from "../models/siteModel.js";

const register = async (req, res) => {
  try {
    const fileName = req.file?.filename;
    const basePath = `${req.protocol}://${req.get("host")}/uploads/`;
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const userExists = await userModel.findOne({ email });
    if (userExists && userExists.verified) {
      throw new Error(
        "User with this email already exist Please login to continue"
      );
      return;
    }
    if (userExists && !userExists.verified) {
      if (req.file?.path) {
        fs.unlink(req.file.path, (err) => {
          if (err) throw new Error(err);
        });
      }
      return res.send({
        message: "check email to verify your account",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
      avatar: `${basePath}${fileName}`,
    });

    const token = await tokenModel.create({
      token: generateToken(await newUser._id),
    });
    const link = `http://localhost:3000/verify/${token.token}`;

    await verifymail(newUser.email, link);

    res.send({
      message: "check your mail to verify your account",
    });
  } catch (error) {
    if (req.file?.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) throw new Error(err);
      });
    }
    res.send(error.message);
  }
};
const verify = async (req, res) => {
  try {
    const token = await tokenModel.findOne({ token: req.params.token });
    const userId = jwt.verify(token.token, process.env.JWt).userId;
    if (!token) {
      throw new Error("Invalid token ");
      return;
    }

    const user = await userModel.findById(userId);
    await userModel.findByIdAndUpdate(user._id, {
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
      avatar: user.avatar,
      isAdmin: user.isAdmin,
      verified: true,
      createdAt: user.createdAt,
      updatedAt: Date.now(),
    });
    res.cookie("token", token).send({
      success: true,
      message: "your account has been verified successfully",
    });
    await tokenModel.findByIdAndRemove(token._id);
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error("Incorrect username or password");
      return;
    }

    const token = generateToken(user._id, process.env.JWt);
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      throw new Error("Incorrect username or password");
      return;
    }
    res.send({
      success: true,
      message: "sigin successfull",
      token: token,
    });
    res.setHe;
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    res.send(users);
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};
export const getUserById = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.params.userId)
      .select("-password");
    if (!user) {
      throw new Error("user not found");
    }
    res.status(200).send({
      success: 200,
      user,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};
export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await userModel.findById(userId).select("cart");
    res.send(cart.cart);
  } catch (error) {
    res.send({
      error: error.message,
    });
  }
};
export const getWishlist = async (req, res) => {
  try {
    const { userId } = req.params;
    const wishlist = await userModel
      .findById(userId)
      .populate("wishlist")
      .select("wishlist");
    res.send(wishlist);
  } catch (error) {
    res.send({
      error: error.message,
    });
  }
};
export const getNotifications = async (req, res) => {
  try {
    const notifications = await siteModel.find().select("notifications");
    res.send(notifications);
  } catch (error) {
    res.send({
      messge: error.message,
    });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.userId).select("password");
    const match = await bcrypt.compare(req.params.password, user.password);
    if (!match) {
      throw new Error("Incorrect password");
    }

    await userModel.findByIdAndDelete(req.params.userId);
    res.send({ message: "account deleted" });
  } catch (error) {
    res.send({
      message: error.message,
    });
  }
};
export { register, verify, login, getAllUsers };
