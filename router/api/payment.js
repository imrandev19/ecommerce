const express = require("express");
const axios = require("axios");
const qs = require("querystring");
const Order = require("../../model/orderModel");
const Product = require("../../model/productModel");

const router = express.Router();

// Load SSLCommerz config from .env
const STORE_ID = process.env.STORE_ID;
const STORE_PASSWORD = process.env.STORE_PASSWORD;
const SSL_API_URL = "https://sandbox.sslcommerz.com/gwprocess/v3/api.php";
const VALIDATION_URL = "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php";

// ✅ Initiate Payment (Online)
router.post("/initiate-payment", async (req, res) => {
  const { totalAmount, tran_id, customerEmail, customerPhone } = req.body;

  try {
    // Find order in DB
    const order = await Order.findOne({ tran_id });
    if (!order) return res.status(404).json({ error: "Order not found" });

    const postData = {
      store_id: STORE_ID,
      store_passwd: STORE_PASSWORD,
      total_amount: totalAmount,
      currency: "BDT",
      tran_id,
      success_url: "http://localhost:4000/api/payment/success",
      fail_url: "http://localhost:4000/api/payment/fail",
      cancel_url: "http://localhost:4000/api/payment/cancel",
      cus_name: "Customer",
      cus_email: customerEmail,
      cus_add1: "Dhaka",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: customerPhone,
      shipping_method: "Courier",
      product_name: "Ecommerce Products",
      product_category: "General",
      product_profile: "general",
    };

    const response = await axios.post(
      SSL_API_URL,
      qs.stringify(postData),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    if (response.data.GatewayPageURL) {
      return res.json({ redirectUrl: response.data.GatewayPageURL });
    } else {
      return res.status(500).json({ error: "Failed to initiate payment" });
    }
  } catch (error) {
    console.error("SSLCommerz Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Payment Success Callback
router.post("/success", async (req, res) => {
  const { tran_id } = req.body;

  try {
    const order = await Order.findOne({ tran_id });
    if (!order) {
      console.error("Order not found for tran_id:", tran_id);
      return res.redirect("http://localhost:3000/payment/fail");
    }

    // Validate transaction with SSLCommerz
    const validation = await axios.get(VALIDATION_URL, {
      params: {
        store_id: STORE_ID,
        store_passwd: STORE_PASSWORD,
        tran_id,
      },
    });

    if (validation.data.status === "VALID") {
      // Update order status to paid
      order.status = "paid";
      await order.save();

      // ✅ Decrease stock for each product if not already decreased
      for (const item of order.products) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity },
        });
      }

      return res.redirect("http://localhost:3000/payment/success");
    } else {
      return res.redirect("http://localhost:3000/payment/fail");
    }
  } catch (error) {
    console.error("Validation Error:", error.response?.data || error.message);
    return res.redirect("http://localhost:3000/payment/fail");
  }
});

// ✅ Payment Fail Callback
router.post("/fail", (req, res) => {
  return res.redirect("http://localhost:3000/payment/fail");
});

// ✅ Payment Cancel Callback
router.post("/cancel", (req, res) => {
  return res.redirect("http://localhost:3000/payment/cancel");
});

module.exports = router;
