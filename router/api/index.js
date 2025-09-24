const express = require ("express")
const router = express.Router()
const authRouter = require ("./auth")
const category = require ("./category")
const subCategory = require("./subcategory")
const product = require("./product")
const variant = require("./variant")
const cart = require("./cart")
const banner = require("./banner")
const orders = require("./order")
const payment = require("./payment")
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
// http://localhost:4000/api/banner
router.use("/banner", banner)
// http://localhost:4000/api/orders
router.use("/orders", orders)
// http://localhost:4000/api/payment
router.use("/payment", payment)

module.exports = router