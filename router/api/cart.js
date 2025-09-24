const express = require("express")
const {addtoCartController, getCartController, deleteCartController} = require("../../controllers/cartController")
const authMiddleware = require("../../middleware/authMiddleware")
const router = express.Router()
// http://localhost:4000/api/cart/addtocart
router.post("/addtocart", authMiddleware, addtoCartController)
// http://localhost:4000/api/cart/getcartitems
router.get("/getcartitems/:id", authMiddleware, getCartController)
router.delete('/delete-cart-item/:id', authMiddleware, deleteCartController)
module.exports = router