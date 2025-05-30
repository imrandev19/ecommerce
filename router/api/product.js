const express = require("express")
const {addproductController, getAllProductsController, getSingleProductsController, delteteProductController} = require("../../controllers/productController")
const authMiddleware = require("../../middleware/authMiddleware")
const adminMiddleware = require("../../middleware/adminMiddleware")
const upload = require("../../helpers/upload")
const router = express.Router()
// http://localhost:4000/api/product/addproduct
router.post("/addproduct", authMiddleware, adminMiddleware, upload.single("thumbnail"), addproductController)
// http://localhost:4000/api/product/getallproducts
router.get("/getallproducts", getAllProductsController)
// http://localhost:4000/api/product/getsingleproducts
router.get("/getsingleproducts/:id", getSingleProductsController)

// http://localhost:4000/api/product/delteproduct
router.delete("/delteproduct/:id", authMiddleware, adminMiddleware, delteteProductController)

module.exports = router