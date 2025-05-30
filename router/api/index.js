const express = require ("express")
const router = express.Router()
const authRouter = require ("./auth")
const category = require ("./category")
const subCategory = require("./subcategory")
const product = require("./product")
const variant = require("./variant")
const cart = require("./cart")
// http://localhost:4000/api/auth
router.use("/auth", authRouter)
// http://localhost:4000/api/category
router.use("/category", category)
// http://localhost:4000/api/subcategory
router.use("/subcategory", subCategory)
// http://localhost:4000/api/product
router.use("/product", product)
// http://localhost:4000/api/variant
router.use("/variant", variant)
// http://localhost:4000/api/cart
router.use("/cart", cart)
module.exports = router