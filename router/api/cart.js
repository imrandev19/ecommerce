const express = require("express")
const {addtoCartController, getCartController} = require("../../controllers/cartController")
const router = express.Router()
// http://localhost:4000/api/cart/addtocart
router.post("/addtocart", addtoCartController)
// http://localhost:4000/api/cart/getcartitems
router.get("/getcartitems/:id", getCartController)
module.exports = router