// models/orderModel.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        title: String,
        price: Number,
        quantity: Number,
      },
    ],
    totalPrice: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["cod", "online"], default: "cod" },
    status: { type: String, enum: ["pending","confirmed","paid","shipped","delivered","cancelled"], default: "pending" },
    tran_id: { type: String, unique: true }, // ✅ important for SSLCommerz
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
