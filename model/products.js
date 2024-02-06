const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true, unique: true },
    desc: { type: String, required: true, },
    imgs: [{ type: String, required: true }],
    categories: [{ type: String }],
    sizes: [{ type: String }], // Array of sizes
    colors: [{ type: String }], // Array of colors
    price: { type: Number, required: true },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Product", ProductSchema);