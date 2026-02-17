const Product = require("../models/product");

const AddProduct = async (req, res) => {
  try {
    const { name, price, description, category, stock, available } = req.body;
    // Validate input
    if (!name || !price || !description || !category || !stock || !available) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // check if product exisst
    const productExist = await Product.findOne({ name });
    if (productExist) {
      return res.status(400).json({ message: "Product already exists" });
    }
    const product = await Product.create({
      name,
      price,
      description,
      category,
      stock,
      available,
    });
    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const GetAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  AddProduct,
  GetAllProducts,
};
