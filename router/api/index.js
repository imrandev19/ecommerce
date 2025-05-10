const express = require ("express")
const router = express.Router()
const authRouter = require ("./auth")
const category = require ("./category")
const subCategory = require("./subcategory")
const product = require("./product")
// http://localhost:4000/api/auth
router.use("/auth", authRouter)
// http://localhost:4000/api/category
router.use("/category", category)
// http://localhost:4000/api/subcategory
router.use("/subcategory", subCategory)
// http://localhost:4000/api/product
router.use("/product", product)
module.exports = router