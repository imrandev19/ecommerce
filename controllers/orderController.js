// controllers/orderController.js
const Order = require("../model/orderModel");
const Product = require("../model/productModel");

// ✅ Create Order
exports.createOrder = async (req, res) => {
  try {
    const { userId, products, totalPrice, paymentMethod, tran_id } = req.body;

    if (!userId || !tran_id) {
      return res.status(400).json({ success: false, message: "userId and tran_id are required" });
    }

    const order = new Order({
      userId,
      products,
      totalPrice,
      paymentMethod,
      status: paymentMethod === "cod" ? "confirmed" : "pending",
      tran_id, // ✅ save frontend tran_id
    });

    await order.save();

    return res.status(201).json({ success: true, message: "Order created", order });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Order creation failed" });
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
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    if (["shipped", "delivered"].includes(order.status)) {
      return res
        .status(400)
        .json({ success: false, message: "Cannot cancel an order that is already shipped or delivered." });
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
