const Product = require("../models/product");
// Add product
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

// Get All Products
const GetAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Delete Product (placeholder - implement as needed)
const DeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    // Implement delete logic here (e.g., Product.findByIdAndDelete(id))
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res
      .status(200)
      .json({ message: `Product with ID ${id} deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  UPDATE - Edit a product
const EditProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, stock, available } = req.body;

    // Check if product exists
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, description, price, category, stock, available },
      { new: true, runValidators: true }, // return updated doc
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  AddProduct,
  GetAllProducts,
  DeleteProduct,
  EditProduct,
};
