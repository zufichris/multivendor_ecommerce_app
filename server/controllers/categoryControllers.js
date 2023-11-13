import productModel from "../models/productModel.js";

export const searchCategory = async (req, res) => {
  try {
    const products = await productModel.find({
      category: req.params.category,
    });
    res.send(products);
  } catch (error) {
    res.send({ message: error.message });
  }
};
export const searchBrand = async (req, res) => {
  try {
    const products = await productModel.find({
      brand: req.params.brand,
    });
    res.send(products);
  } catch (error) {
    res.send({
      message: error.message,
    });
  }
};
