import productModel from "../models/productModel.js";
export const searchProducts = async (req, res) => {
  try {
    const { name } = req.params;
    const result = await productModel
      .find({
        name: { $regex: `${name}`, $options: "i" },
      })
      .select("name image price")
      .limit(10);
    res.send(result);
  } catch (error) {
    res.send({ error: error.message });
  }
};
