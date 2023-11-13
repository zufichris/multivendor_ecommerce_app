import mongoose from "mongoose";
import productModel from "../models/productModel.js";
import userModel from "../models/UserModel.js";
import fs from "fs";
export const createProduct = async (req, res) => {
  try {
    const { name } = req.body.name;
    const productExists = await productModel.findOne({ name: name });
    if (productExists) {
      throw new Error("This product already exists");
      return;
    }
    const basePath = `${req.protocol}://${req.get("host")}/uploads/`;
    const fileName = req.file?.filename;
    req.body.image = `${basePath}${fileName}`;
    const product = await productModel.create(req.body);
    res.send(product);
  } catch (error) {
    if (req.file?.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) throw new Error(err);
      });
    }
    res.send({
      error: error.message,
    });
  }
};
export const getAllProduct = async (req, res) => {
  try {
    const products = await productModel.find().populate("category");
    res.send(products);
  } catch (error) {
    res.send({
      error: error.message,
    });
  }
};
export const getProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.productId);
    res.send(product);
  } catch (error) {
    res.send({
      error: error.message,
    });
  }
};
export const getFeatured = async (req, res) => {
  try {
    const limit = req.params.limit || 10;
    const products = await productModel
      .find({ isFeatured: true })
      .populate("category")
      .limit(+limit);
    res.send(products);
  } catch (error) {
    res.send({
      error: error.message,
    });
  }
};
export const updateProduct = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.productId)) {
      throw new Error("Inavlid Product ID");
    }
    const product = await productModel
      .findById(req.params.productId)
      .select("image");
    const imagePaths = [product.image];
    const basePath = `${req.protocol}://${req.get("host")}/uploads/`;
    if (req?.files) {
      req.files.map((file) => {
        imagePaths.push(`${basePath}${file.filename}`);
      });
    }
    await productModel.findByIdAndUpdate(req.params.productId, {
      images: imagePaths,
    });
    res.send({ message: "gallery updated" });
  } catch (error) {
    if (req.files) {
      req.files.map((file) => {
        fs.unlink(file.path, (err) => {
          if (err) throw new Error(err);
        });
      });
      res.send({
        error: error.message,
      });
    }
  }
};
export const deleteProduct = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.productId)) {
      throw new Error("Inavlid Product ID");
    }

    await productModel.findByIdAndDelete(req.params.productId);
    res.send({
      message: "product deleted",
    });
  } catch (error) {
    res.send({
      error: error.message,
    });
  }
};
export const addToCart = async (req, res) => {
  try {
    const userId = req.params.userId;
    const productId = req.params.productId;
    const user = await userModel.findById(userId);
    if (!user) {
      throw new Error("Invalid user");
    }
    const product = await productModel.findById(productId);
    if (!productId) {
      throw new Error("invalid product");
    }

    const exist = await user.cart.cartItems.find(
      (item) => item.product == productId
    );
    if (exist) {
      user.cart.totalAmount -= exist.amount;
      user.cart.totalPrice -= exist.amount * product.price;
      exist.amount = req.body.amount;
      exist.price = product.price * req.body.amount;
      user.cart.totalAmount += req.body.amount;
      user.cart.totalPrice += product.price * req.body.amount;
      await user.save();
      return res.send(user.cart);
    }
    user.cart.cartItems.push({
      product: productId,
      amount: req.body.amount || 1,
      price: product.price,
    });
    user.cart.totalAmount += req.body.amount;
    user.cart.totalPrice += product.price * req.body.amount;
    await user.save();
    res.send(user.cart);
  } catch (error) {
    res.send({ error: error.message });
  }
};
export const deleteFromCart = async (req, res) => {
  try {
    const userId = req.params.userId;
    const productId = req.params.productId;
    const user = await userModel.findById(userId);
    const exist = await user.cart.cartItems.find(
      (item) => item.product == productId
    );
    user.cart.totalAmount -= exist.amount;
    user.cart.totalPrice -= exist.price;
    user.cart.cartItems.pop(exist);
    await user.save();
    res.send(user.cart);
  } catch (error) {
    res.send({
      error: error.message,
    });
  }
};
export const addToWishlist = async (req, res) => {
  const { userId, productId } = req.params;
  try {
    const user = await userModel.findById(userId);
    const product = await productModel.findById(productId);
    if (!product) {
      throw new Error("Invalid product");
    }
    const exist = user.wishlist.find((id) => productId == id);
    if (exist) {
      user.wishlist.pop(exist);
    } else {
      user.wishlist.push(productId);
    }
    await user.save();
    res.send(user.wishlist);
  } catch (error) {
    res.status(400).send({
      error: error.message,
    });
  }
};
export const addToFeature = async (req, res) => {
  try {
    const product = await productModel.findByIdAndUpdate(
      req.params.productId,
      { isFeatured: req.body.isFeatured },
      { new: true }
    );
    res.send({
      message: "feature updated",
    });
  } catch (error) {
    res.send({
      error: error.message,
    });
  }
};
