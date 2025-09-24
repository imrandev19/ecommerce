const express = require("express")

const { createOrder, getUserOrders, cancelOrder } = require("../../controllers/orderController")
const router = express.Router()
//Add order
router.post("/", createOrder)
// GET /api/orders/:userId
router.get("/user/:userId", getUserOrders);

// DELETE /api/orders/:orderId
router.delete("/:orderId", cancelOrder);

module.exports = router