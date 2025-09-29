const express = require("express")
const axios = require('axios');
const { createOrder, getUserOrders, cancelOrder, paymentSuccess, paymentFail, paymentCancel  } = require("../../controllers/orderController");
const orderModel = require("../../model/orderModel");
const productModel = require("../../model/productModel");
const userModel = require("../../model/userModel");
const cartModel = require("../../model/cartModel");
const router = express.Router()
//Add order
router.post("/", createOrder)
router.post("/success", async (req,res)=>{
    
    try {
    const { tran_id, val_id } = req.body; // SSLCommerz sends both

    // ✅ Validate payment with SSLCommerz
    const response = await axios.get("https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php", {
      params: {
        val_id,
        store_id: process.env.SSL_STORE_ID,
        store_passwd: process.env.SSL_STORE_PASSWORD,
        format: "json"
      }
    });

    const validation = response.data;

    if (validation.status === "VALID" || validation.status === "VALIDATED") {
      // ✅ Find order
      const order = await orderModel.findOne({ tran_id });
      if (!order) {
        return res.redirect("http://localhost:3000/payment/fail");
      }

      // ✅ Deduct stock
      for (const item of order.products) {
        await productModel.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity },
        });
      }

      // ✅ Update order status
      order.status = "confirmed";
      await order.save();

      return res.redirect("http://localhost:3000/payment/success");
    } else {
      return res.redirect("http://localhost:3000/payment/fail");
    }
  } catch (err) {
    console.error("Payment success error:", err.response?.data || err.message);
    return res.redirect("http://localhost:3000/payment/fail");
  }
})
router.post("/fail",(req,res)=>{
    res.redirect("http://localhost:3000/payment/fail")
})
router.post("/cancel",(req,res)=>{
    res.redirect("http://localhost:3000/payment/cancel")
})
router.get("/user/:userId", getUserOrders);

// DELETE /api/orders/:orderId
router.delete("/:orderId", cancelOrder);

module.exports = router