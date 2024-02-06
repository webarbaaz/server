const mongoose = require("mongoose");

const OrdersSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',  // Reference the Product model
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        size: {
          type: String,
          required: true,
        },
        color: {
          type: String,
          required: true,
        },
      },
    ],
    totalAmount: { type: Number, required: true },
    address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
    status: { type: Object, default: "pending" },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Orders", OrdersSchema);
