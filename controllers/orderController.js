const Order = require("../model/orderModel");
const Product = require("../model/productModel");
const axios = require("axios");
const userModel = require("../model/userModel")
const qs = require("querystring");
const SSLCommerzPayment = require('sslcommerz-lts')
// SSLCommerz config
const store_id = process.env.SSL_STORE_ID
const store_passwd = process.env.SSL_STORE_PASSWORD
const is_live = false //true for live, false for sandbox

// Create Order
exports.createOrder = async (req, res) => {
  try {
    const {
      userId,
      products,
      totalPrice,
      paymentMethod,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      customerCity,
      customerState,
      customerPostcode,
      customerCountry,
    } = req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "userId is required" });
    }

    // ✅ Generate unique tran_id on backend
    const tran_id = "ORDER-" + Date.now();

    const order = new Order({
      userId,
      products,
      totalPrice,
      paymentMethod,
      status: paymentMethod === "cod" ? "confirmed" : "pending",
      tran_id,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      customerCity,
      customerState,
      customerPostcode,
      customerCountry,
    });

    await order.save();

    // ✅ COD: Deduct stock immediately
    if (paymentMethod === "cod") {
      
      for (const item of products) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity },
        });
      }

      return res
        .status(201)
        .json({ success: true, message: "Order placed with COD", order });
    }

    // ✅ Online Payment Flow
    else{
      const userInfo = await userModel.findById(userId)
   console.log(userInfo)
    const data = {
        total_amount: totalPrice,
        emi_option: 0,
        currency: 'BDT',
        tran_id: tran_id, // use unique tran_id for each api call
        success_url: 'http://localhost:4000/api/orders/success',
        fail_url: 'http://localhost:4000/api/orders/fail',
        cancel_url: 'http://localhost:4000/api/orders/cancel',
        // ipn_url: 'http://localhost:3000/ipn',
        shipping_method: 'Courier',
        product_name: 'Computer.',
        product_category: 'Electronic',
        product_profile: 'general',
        cus_name: userInfo.username,
        cus_email: userInfo.email,
        cus_add1: customerAddress,
        cus_add2: customerAddress,
        cus_city: customerCity,
        cus_state: customerState,
        cus_postcode: customerPostcode,
        cus_country: customerCountry,
        cus_phone: customerPhone,
        ship_name: userInfo.username,
        ship_add1: customerAddress,
        ship_add2: customerAddress,
        ship_city: customerCity,
        ship_state: customerState,
        ship_postcode: customerPostcode,
        ship_country: customerCountry,
    };
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
    sslcz.init(data).then(apiResponse => {
        // Redirect the user to payment gateway
        let GatewayPageURL = apiResponse.GatewayPageURL
        return res
           .status(201)
           .json({ success: true, message: "Order placed with Online payment",
            paymenturl:GatewayPageURL
            });
    });
   

    }
      
  } catch (err) {
    console.error("Order creation error:", err.response?.data || err.message);
    return res
      .status(500)
      .json({ success: false, message: err.message || "Order creation failed" });
  }
};






// ✅ Get all orders for logged-in user
exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    console.error("Fetch orders failed:", err);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

// ✅ Cancel order (only if not shipped)
exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    if (["shipped", "delivered"].includes(order.status)) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "Cannot cancel an order that is already shipped or delivered.",
        });
    }

    // ✅ Restore stock
    for (const item of order.products) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: item.quantity },
      });
    }

    // ✅ Delete order
    await Order.findByIdAndDelete(orderId);

    res.json({ success: true, message: "Order cancelled successfully" });
  } catch (err) {
    console.error("Cancel order failed:", err);
    res.status(500).json({ success: false, message: "Failed to cancel order" });
  }
};
