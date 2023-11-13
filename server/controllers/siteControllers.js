import userModel from "../models/UserModel.js";
import productModel from "../models/productModel.js";
import siteModel from "../models/siteModel.js";
import fs from "fs";
export const createNotification = async (req, res) => {
  try {
    const basePath = `${req.protocol}://${req.get("host")}/uploads/`;
    const fileName = req.file?.filename;
    req.body.image = `${basePath}${fileName}`;
    const __ = await siteModel.findOne();
    __.notifications.push(req.body);
    __.save();
    res.send({
      message: "Notification sent",
    });
  } catch (error) {
    if (req.file?.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) throw new Error(err);
      });
    }
    res.send({
      message: error.message,
    });
  }
};
export const deleteNotification = async (req, res) => {
  try {
    const __ = await siteModel.findOne();

    const match = __.notifications.find((note) => {
      return note._id != req.params.notificationId;
    });
    __.notifications.pop(match);
    await __.save();

    res.send({
      message: "deleted",
    });
  } catch (error) {}
};
export const siteVisits = async (req, res) => {
  try {
    const __ = await siteModel.findOne();
    __.visits++;
    await __.save();
    res.status(200).send({
      message: "+1 visit",
    });
  } catch (error) {
    res.send({
      error: error.message,
    });
  }
};

export const siteData = async (req, res) => {
  try {
    const products = await productModel.count();
    const { notifications, visits } = await siteModel.findOne();
    const users = await userModel.count();
    res.send({ products, users, visits, notifications: notifications.length });
  } catch (error) {
    res.send({ error: error.message });
  }
};
