const express = require("express")
const addproductController = require("../../controllers/productController")
const router = express.Router()
// http://localhost:4000/api/product/addproduct
router.post("/addproduct", addproductController)
module.exports = router