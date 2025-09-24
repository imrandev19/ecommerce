const express = require("express");
const axios = require("axios");
const qs = require("querystring");
const sslcommerzConfig = require("../../config/sslcommerzConfig");
const Order = require("../../model/orderModel");

const router = express.Router();

// ✅ Initiate Payment
router.post("/initiate-payment", async (req, res) => {
  const { totalAmount, tran_id, customerEmail, customerPhone } = req.body;

  try {
    const order = await Order.findOne({ tran_id });
    if (!order) return res.status(404).json({ error: "Order not found" });

    const postData = {
      store_id: sslcommerzConfig.store_id,
      store_passwd: sslcommerzConfig.store_passwd,
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
      sslcommerzConfig.API_URL,
      qs.stringify(postData),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    if (response.data.GatewayPageURL) res.json({ redirectUrl: response.data.GatewayPageURL });
    else res.status(500).json({ error: "Failed to initiate payment" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Success
// Payment Success Callback
router.post("/success", async (req, res) => {
  // SSLCommerz might send tran_id in body or query
  const tran_id = req.body.tran_id || req.query.tran_id;

  if (!tran_id) {
    console.error("tran_id not found in success callback", req.body, req.query);
    return res.redirect("http://localhost:3000/payment/fail");
  }

  try {
    const order = await Order.findOne({ tran_id });
    if (!order) {
      console.error("Order not found for tran_id:", tran_id);
      return res.redirect("http://localhost:3000/payment/fail");
    }

    // Validate transaction with SSLCommerz
    const validation = await axios.get(sslcommerzConfig.VALIDATION_URL, {
      params: {
        store_id: sslcommerzConfig.store_id,
        store_passwd: sslcommerzConfig.store_passwd,
        tran_id,
      },
    });

    if (validation.data.status === "VALID") {
      order.status = "paid";
      await order.save();
      return res.redirect("http://localhost:3000/payment/success");
    } else {
      return res.redirect("http://localhost:3000/payment/fail");
    }
  } catch (err) {
    console.error("Validation Error:", err.response?.data || err.message);
    return res.redirect("http://localhost:3000/payment/fail");
  }
});


// ✅ Fail
router.post("/fail", (req, res) => {
  return res.redirect("http://localhost:3000/payment/fail");
});

// ✅ Cancel
router.post("/cancel", (req, res) => {
  return res.redirect("http://localhost:3000/payment/cancel");
});

module.exports = router;
