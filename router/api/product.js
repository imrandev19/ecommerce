const express = require("express")
const addproductController = require("../../controllers/productController")
const authMiddleware = require("../../middleware/authMiddleware")
const adminMiddleware = require("../../middleware/adminMiddleware")
const upload = require("../../helpers/upload")
const router = express.Router()
// http://localhost:4000/api/product/addproduct
router.post("/addproduct", authMiddleware, adminMiddleware, upload.single("thumbnail"), addproductController)
module.exports = router