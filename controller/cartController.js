const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Cart = require("../model/cart");
const Products = require("../model/products");

const getCart = asyncHandler(async (req, res) => {
  // get the user id
  const { userId } = req.params;

  if (!userId) {
    throw new Error("User not found");
  }

  // Convert userId to a valid ObjectId
  const validUserId = new mongoose.Types.ObjectId(userId);

  // Retrieve cart items for the specified user
  const cartItems = await Cart.find({
    userId: validUserId,
  }).populate("productId");

  if (!cartItems || cartItems.length === 0) {
    res
      .status(404)
      .json({ status: false, message: "No items found in the cart" });
    return;
  }

  res.status(200).json({ cartItems });
});

const postCart = asyncHandler(async (req, res) => {
  const { productId, quantity, size, color } = req.body;
  const { userId } = req.params;

  if (!userId) {
    throw new Error("User not found");
  }

  // Check if the product exists
  const product = await Products.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  // Validate data
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error("Invalid quantity");
  }

  // Check if the item is already in the cart for the specific user
  const existingCartItem = await Cart.findOne({ userId, productId });

  if (existingCartItem) {
    return res.status(200).json({
      success: true,
      message: "Item already added to cart successfully",
    });
  }
  // If not, add a new item to the cart for the specific user
  const newCartItem = new Cart({
    userId: new mongoose.Types.ObjectId(userId),
    productId: new mongoose.Types.ObjectId(productId),
    quantity,
    size,
    color,
  });
  await newCartItem.save();
  res
    .status(200)
    .json({ success: true, message: "Item added to cart successfully" });
});

const patchCart = asyncHandler(async (req, res) => {
  const { productId, quantity, size, color } = req.body;
  const { userId } = req.params;

  if (!userId) {
    throw new Error("User not found");
  }

  // Check if the product exists
  const product = await Products.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  // Validate data
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error("Invalid quantity");
  }
  // Check if the item is already in the cart for the specific user
  const existingCartItem = await Cart.findOne({ userId, productId });

  if (existingCartItem) {
    // If yes, update the quantity
    existingCartItem.quantity = quantity;
    existingCartItem.color = color;
    existingCartItem.size = size;
    await existingCartItem.save();
  }
  res.status(200).json({
    success: true,
    message: "Cart item updated successfully",
    updatedCartItem: existingCartItem,
  });
});

const deleteCart = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const { userId } = req.params;

  // Ensure userId is provided
  if (!userId) {
    throw new Error("User not found");
  }

  if (productId) {
    // Delete a single cart item for the specific user and product
    const result = await Cart.deleteOne({ userId, productId });

    res.status(200).json({
      success: true,
      message:
        result.deletedCount === 1
          ? `Deleted the cart item with product ID ${productId} for user with ID ${userId}`
          : `No cart item found with product ID ${productId} for user with ID ${userId}`,
    });
  } else {
    // Delete all cart items for the specific user
    const result = await Cart.deleteMany({ userId });

    res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} cart items for user with ID ${userId}`,
    });
  }
});

module.exports = { deleteCart, getCart, postCart, patchCart };
