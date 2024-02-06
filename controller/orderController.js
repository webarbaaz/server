const asyncHandler = require("express-async-handler");
const Cart = require("../model/cart");
const Orders = require("../model/orders");
const Address = require("../model/address");

const postOrder = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { address } = req.body;

  // Ensure userId and address are provided
  if (!userId || !address) {
    return res.status(400).json({ success: false, message: "Invalid input" });
  }

  // Ensure all address fields are provided
  const requiredAddressFields = [
    "address",
    "city",
    "pinCode",
    "state",
    "country",
  ];
  if (!requiredAddressFields.every((field) => address[field])) {
    return res
      .status(400)
      .json({ success: false, message: "All address fields are required" });
  }

  // Get cart items for the specific user
  const cartItems = await Cart.find({ userId }).populate("productId");

  // Check if the cart is empty
  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Cart is empty. Add items before placing an order.",
    });
  }

  // Calculate total amount based on cart items
  const totalAmount = cartItems.reduce(
    (total, item) => total + item.productId.price * item.quantity,
    0
  );

  // Update the status of all addresses for the given user
  await Address.updateMany({ userId }, { $set: { status: false } });

  // Find or create the address
  const orderAddress = await Address.findOneAndUpdate(
    { userId, ...address }, // Find query
    { userId, ...address, status: true }, // Update document
    { upsert: true, new: true } // This option stands for "update or insert"
  );

  // Create a new order
  const newOrder = new Orders({
    userId,
    products: cartItems.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
    })),
    totalAmount,
    address: orderAddress._id,
    status: "pending",
  });

  // Save the order to the database
  await newOrder.save();

  // Clear the user's cart
  await Cart.deleteMany({ userId });

  res.status(201).json({
    success: true,
    message: "Order placed successfully",
    order: newOrder,
  });
});

const getOrders = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Ensure userId is provided
  if (!userId) {
    throw new Error("User not found");
  }

  // find all the order for the userId
  const orders = await Orders.find({ userId })
    .populate("products.productId")
    .populate("address");

  // check if there is orders or not
  if (!orders || orders.length === 0) {
    return res
      .status(404)
      .json({ success: false, message: "No orders found." });
  }

  res.status(200).json({
    success: true,
    orders: orders,
  });
});

module.exports = { postOrder, getOrders };
