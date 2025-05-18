const express = require("express")
const addtoCartController = require("../../controllers/cartController")
const router = express.Router()
// http://localhost:4000/api/cart/addtocart
router.post("/addtocart", addtoCartController)
module.exports = router