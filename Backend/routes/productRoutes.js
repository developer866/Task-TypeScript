const express = require("express")
const { AddProduct, GetAllProducts } = require("../controller/productController");

const router = express.Router();

router.get("/", GetAllProducts);
router.post("/Addproduct", AddProduct);

module.exports = router; 