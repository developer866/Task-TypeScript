const express = require("express")
const { AddProduct, GetAllProducts ,DeleteProduct} = require("../controller/productController");

const router = express.Router();

router.get("/", GetAllProducts);
router.post("/Addproduct", AddProduct);
router.delete("/:id", DeleteProduct); 

module.exports = router; 