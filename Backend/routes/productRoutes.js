const express = require("express")
const { AddProduct, GetAllProducts ,DeleteProduct,EditProduct} = require("../controller/productController");

const router = express.Router();

router.get("/", GetAllProducts);
router.post("/Addproduct", AddProduct);
router.delete("/:id", DeleteProduct); 
router.put("/:id", EditProduct); 

module.exports = router; 