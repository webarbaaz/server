const mongoose = require("mongoose");

const CartSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  size: { 
    type: String,
    required: true,
  },
  color: { 
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Cart", CartSchema);
