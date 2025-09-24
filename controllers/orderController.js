const Order = require("../model/orderModel");
const Product = require("../model/productModel");

exports.createOrder = async (req, res) => {
  try {
    const { userId, products, totalPrice, paymentMethod } = req.body;

    // ✅ Save order
    const order = new Order({
      userId,
      products,
      totalPrice,
      paymentMethod,
      status: "confirmed",
    });
    await order.save();

    // ✅ Decrease stock for each product
    for (const item of products) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    return res.status(201).json({ success: true, message: "Order confirmed!", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Order failed" });
  }
};
// ✅ Get all orders for logged in user
exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

// ✅ Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    // Restore stock
    for (const item of order.products) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: item.quantity },
      });
    }

    // Delete order
    await Order.findByIdAndDelete(orderId);

    res.json({ success: true, message: "Order cancelled successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to cancel order" });
  }
};