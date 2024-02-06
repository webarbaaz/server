const asyncHandler = require("express-async-handler");
const Order = require("../model/orders");
const User = require("../model/user");
const Payment = require("../model/payment");

const getUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    res.status(404).json({ status: false, message: "Invalid inputs" });
    return;
  }

  const user = await User.findOne({ _id: userId }).select("-password");

  if (!user) {
    res.status(404).json({ status: false, message: "No user found" });
    return;
  }

  res.status(200).json({ status: true, user });
});

const patchUser = asyncHandler(async (req, res) => {});

// const getCart = asyncHandler(async (req, res) => {
//   // get the user id
//   const { userId } = req.params;

//   if (!userId) {
//     throw new Error("User not found");
//   }

//   // Convert userId to a valid ObjectId
//   const validUserId = new mongoose.Types.ObjectId(userId);

//   // Retrieve cart items for the specified user
//   const cartItems = await Cart.find({
//     userId: validUserId,
//   }).populate("productId");

//   if (!cartItems || cartItems.length === 0) {
//     res
//       .status(404)
//       .json({ status: false, message: "No items found in the cart" });
//     return;
//   }

//   res.status(200).json({ cartItems });
// });

// const postCart = asyncHandler(async (req, res) => {
//   const { productId, quantity, size, color } = req.body;
//   const { userId } = req.params;

//   if (!userId) {
//     throw new Error("User not found");
//   }

//   // Check if the product exists
//   const product = await Product.findById(productId);
//   if (!product) {
//     throw new Error("Product not found");
//   }

//   // Validate data
//   if (!Number.isInteger(quantity) || quantity <= 0) {
//     throw new Error("Invalid quantity");
//   }

//   // Check if the item is already in the cart for the specific user
//   const existingCartItem = await Cart.findOne({ userId, productId });

//   if (existingCartItem) {
//     return res.status(200).json({
//       success: true,
//       message: "Item already added to cart successfully",
//     });
//   }
//   // If not, add a new item to the cart for the specific user
//   const newCartItem = new Cart({
//     userId: new mongoose.Types.ObjectId(userId),
//     productId: new mongoose.Types.ObjectId(productId),
//     quantity,
//     size,
//     color,
//   });
//   await newCartItem.save();
//   res
//     .status(200)
//     .json({ success: true, message: "Item added to cart successfully" });
// });

// const patchCart = asyncHandler(async (req, res) => {
//   const { productId, quantity, size, color } = req.body;
//   const { userId } = req.params;

//   if (!userId) {
//     throw new Error("User not found");
//   }

//   // Check if the product exists
//   const product = await Product.findById(productId);
//   if (!product) {
//     throw new Error("Product not found");
//   }

//   // Validate data
//   if (!Number.isInteger(quantity) || quantity <= 0) {
//     throw new Error("Invalid quantity");
//   }
//   // Check if the item is already in the cart for the specific user
//   const existingCartItem = await Cart.findOne({ userId, productId });

//   if (existingCartItem) {
//     // If yes, update the quantity
//     existingCartItem.quantity = quantity;
//     existingCartItem.color = color;
//     existingCartItem.size = size;
//     await existingCartItem.save();
//   }
//   res.status(200).json({
//     success: true,
//     message: "Cart item updated successfully",
//     updatedCartItem: existingCartItem,
//   });
// });

// const deleteCart = asyncHandler(async (req, res) => {
//   const { productId } = req.body;
//   const { userId } = req.params;

//   // Ensure userId is provided
//   if (!userId) {
//     throw new Error("User not found");
//   }

//   if (productId) {
//     // Delete a single cart item for the specific user and product
//     const result = await Cart.deleteOne({ userId, productId });

//     res.status(200).json({
//       success: true,
//       message:
//         result.deletedCount === 1
//           ? `Deleted the cart item with product ID ${productId} for user with ID ${userId}`
//           : `No cart item found with product ID ${productId} for user with ID ${userId}`,
//     });
//   } else {
//     // Delete all cart items for the specific user
//     const result = await Cart.deleteMany({ userId });

//     res.status(200).json({
//       success: true,
//       message: `Deleted ${result.deletedCount} cart items for user with ID ${userId}`,
//     });
//   }
// });

// const postOrder = asyncHandler(async (req, res) => {
//   const { userId } = req.params;
//   const { address } = req.body;

//   // Ensure userId and address are provided
//   if (!userId || !address) {
//     return res.status(400).json({ success: false, message: "Invalid input" });
//   }

//   // Ensure all address fields are provided
//   const requiredAddressFields = [
//     "address",
//     "city",
//     "pinCode",
//     "state",
//     "country",
//   ];
//   if (!requiredAddressFields.every((field) => address[field])) {
//     return res
//       .status(400)
//       .json({ success: false, message: "All address fields are required" });
//   }

//   // Get cart items for the specific user
//   const cartItems = await Cart.find({ userId }).populate("productId");

//   // Check if the cart is empty
//   if (!cartItems || cartItems.length === 0) {
//     return res.status(400).json({
//       success: false,
//       message: "Cart is empty. Add items before placing an order.",
//     });
//   }

//   // Calculate total amount based on cart items
//   const totalAmount = cartItems.reduce(
//     (total, item) => total + item.productId.price * item.quantity,
//     0
//   );

//   // Update the status of all addresses for the given user
//   await Address.updateMany({ userId }, { $set: { status: false } });

//   // Find or create the address
//   const orderAddress = await Address.findOneAndUpdate(
//     { userId, ...address }, // Find query
//     { userId, ...address, status: true }, // Update document
//     { upsert: true, new: true } // This option stands for "update or insert"
//   );

//   // Create a new order
//   const newOrder = new Order({
//     userId,
//     products: cartItems.map((item) => ({
//       productId: item.productId._id,
//       quantity: item.quantity,
//       size: item.size,
//       color: item.color,
//     })),
//     totalAmount,
//     address: orderAddress._id,
//     status: "pending",
//   });

//   // Save the order to the database
//   await newOrder.save();

//   // Clear the user's cart
//   await Cart.deleteMany({ userId });

//   res.status(201).json({
//     success: true,
//     message: "Order placed successfully",
//     order: newOrder,
//   });
// });

// const processPayment = asyncHandler(async (req, res) => {
//   const { orderId, amount, paymentMethod, transactionId } = req.body;
//   console.log({ orderId, amount, paymentMethod, transactionId });
//   if (!orderId || !amount || !paymentMethod || !transactionId) {
//     res.status(400).json({ status: false, message: "invalid inputs" });
//     return;
//   }

//   // Create a new payment record with status set to 'pending'
//   const payment = new Payment({
//     orderId,
//     amount,
//     paymentMethod,
//     transactionId,
//     status: "pending",
//   });

//   // Save the payment record to the database
//   await payment.save();

//   // Logic for processing the payment
//   // This could involve interacting with a payment gateway or processor

//   // For demonstration purposes, let's assume the payment is successful
//   // Update the payment status to 'completed'
//   payment.status = "completed";
//   await payment.save();

//   // Update the status of the associated order to 'paid'
//   await Order.findByIdAndUpdate({ _id: orderId }, { status: "paid" });

//   res.status(201).json({ success: true, payment });
// });

// const getOrders = asyncHandler(async (req, res) => {
//   const { userId } = req.params;

//   // Ensure userId is provided
//   if (!userId) {
//     throw new Error("User not found");
//   }

//   // find all the order for the userId
//   const orders = await Order.find({ userId })
//     .populate("products.productId")
//     .populate("address");

//   // check if there is orders or not
//   if (!orders || orders.length === 0) {
//     return res
//       .status(404)
//       .json({ success: false, message: "No orders found." });
//   }

//   res.status(200).json({
//     success: true,
//     orders: orders,
//   });
// });

// const getAddress = asyncHandler(async (req, res) => {
//   const { userId } = req.params;

//   // Ensure userId is provided
//   if (!userId) {
//     res.status(400).json({ success: false, message: "User not found" });
//     return;
//   }

//   const allAddress = await Address.find({ userId });

//   if (!allAddress || allAddress.length === 0) {
//     res.status(400).json({
//       success: false,
//       message: "No address were found.",
//     });
//     return;
//   }

//   res.status(200).json({
//     success: true,
//     address: allAddress,
//   });
// });

// const postAddress = asyncHandler(async (req, res) => {
//   const { userId } = req.params;
//   const { address } = req.body;

//   // Ensure userId and address are provided
//   if (!userId || !address) {
//     return res.status(400).json({ success: false, message: "Invalid input" });
//   }

//   // Ensure all address fields are provided
//   const requiredAddressFields = [
//     "address",
//     "city",
//     "pinCode",
//     "state",
//     "country",
//   ];
//   if (!requiredAddressFields.every((field) => address[field])) {
//     return res
//       .status(400)
//       .json({ success: false, message: "All address fields are required" });
//   }

//   // Check if the address already exists
//   const existingAddress = await Address.findOne({ userId, ...address });

//   if (existingAddress) {
//     return res
//       .status(400)
//       .json({ success: false, message: "Address already exists" });
//   }

//   // Create a new address
//   const newAddress = new Address({
//     userId: new mongoose.Types.ObjectId(userId),
//     ...address,
//   });

//   // Save the new address to the database
//   const savedAddress = await newAddress.save();

//   res.status(201).json({
//     success: true,
//     message: "Address added successfully",
//     address: savedAddress,
//   });
// });

// const patchAddress = asyncHandler(async (req, res) => {
//   const { userId } = req.params;
//   const { addressId, address } = req.body;

//   // Ensure userId and addressId are provided
//   if (!userId || !addressId) {
//     return res.status(400).json({ success: false, message: "Invalid input" });
//   }

//   // Ensure all address fields are provided
//   const requiredAddressFields = [
//     "address",
//     "city",
//     "pinCode",
//     "state",
//     "country",
//   ];
//   if (!requiredAddressFields.every((field) => address[field])) {
//     return res
//       .status(400)
//       .json({ success: false, message: "All address fields are required" });
//   }

//   const updatedAddress = await Address.findOneAndUpdate(
//     { _id: new mongoose.Types.ObjectId(addressId) },
//     { $set: { ...address } },
//     { new: true } // To return the updated document
//   );

//   if (!updatedAddress) {
//     return res
//       .status(404)
//       .json({ success: false, message: "Address not found" });
//   }

//   res.status(200).json({
//     success: true,
//     message: "Address updated successfully",
//     address: updatedAddress,
//   });
// });

// const deleteAddress = asyncHandler(async (req, res) => {
//   const { userId } = req.params;
//   const { addressId } = req.body;

//   // Ensure userId and addressId are provided
//   if (!userId || !addressId) {
//     return res.status(400).json({ success: false, message: "Invalid input" });
//   }
//   // Find and delete the address
//   const deletedAddress = await Address.findOneAndDelete({
//     userId: new mongoose.Types.ObjectId(userId),
//     _id: new mongoose.Types.ObjectId(addressId),
//   });

//   if (!deletedAddress) {
//     return res
//       .status(404)
//       .json({ success: false, message: "Address not found" });
//   }

//   res.status(200).json({
//     success: true,
//     message: "Address deleted successfully",
//     address: deletedAddress,
//   });
// });

// const postWishList = asyncHandler(async (req, res) => {
//   const { userId, productId } = req.body;

//   if (!userId || !productId) {
//     return res.status(404).json({ success: false, message: "Invalid inputs" });
//   }

//   // Check if the product is already in the cart
//   const existingItem = await Wishlist.findOne({
//     user: userId,
//     product: productId,
//   });

//   if (!existingItem) {
//     // Product is not in the wishlist, so create a new wishlist item
//     const wishlistItem = new Wishlist({
//       user: userId,
//       product: productId,
//     });

//     await wishlistItem.save();

//     return res.status(201).json({
//       success: true,
//       message: "Product added to wishlist",
//       wishlist: wishlistItem,
//     });
//   }

//   res
//     .status(200)
//     .json({ success: true, message: "Product is already added to wishlist" });
// });

// const getWishList = asyncHandler(async (req, res) => {
//   const { userId } = req.params;

//   const wishlistItems = await Wishlist.find({ user: userId }).populate(
//     "product"
//   );

//   if (!wishlistItems) {
//     return res.status(404).json({
//       success: false,
//       message: "No items in the wishlist",
//       wishlistItems: [],
//     });
//   }

//   res.status(200).json({
//     success: true,
//     wishlistItems,
//     message: "Successfully added to wishlist",
//   });
// });

// const deleteWishList = asyncHandler(async (req, res) => {
//   const { userId } = req.params;
//   const { wishlistId } = req.body;

//   if (!userId || !wishlistId) {
//     return res.status(400).json({ success: false, message: "Invalid inputs" });
//   }

//   const deletedProduct = await Wishlist.findOneAndDelete({ _id: wishlistId });

//   if (!deletedProduct) {
//     return res
//       .status(404)
//       .json({ success: false, message: "Product not found in wishlist" });
//   }

//   res
//     .status(200)
//     .json({ success: true, message: "Product removed from wishlist" });
// });

module.exports = {
  getUser,
  patchUser,
  // getCart,
  // postCart,
  // patchCart,
  // deleteCart,
  // postOrder,
  // getOrders,
  // getAddress,
  // postAddress,
  // deleteAddress,
  // patchAddress,
  // processPayment,
  // postWishList,
  // getWishList,
  // deleteWishList,
};
