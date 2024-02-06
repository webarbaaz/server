const asyncHandler = require("express-async-handler");
const Wishlist = require("../model/wishlist");

const postWishList = asyncHandler(async (req, res) => {
  const { userId, productId } = req.body;

  if (!userId || !productId) {
    return res.status(404).json({ success: false, message: "Invalid inputs" });
  }

  // Check if the product is already in the cart
  const existingItem = await Wishlist.findOne({
    user: userId,
    product: productId,
  });

  if (!existingItem) {
    // Product is not in the wishlist, so create a new wishlist item
    const wishlistItem = new Wishlist({
      user: userId,
      product: productId,
    });

    await wishlistItem.save();

    return res.status(201).json({
      success: true,
      message: "Product added to wishlist",
      wishlist: wishlistItem,
    });
  }

  res
    .status(200)
    .json({ success: true, message: "Product is already added to wishlist" });
});

const getWishList = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const wishlistItems = await Wishlist.find({ user: userId }).populate(
    "product"
  );

  if (!wishlistItems) {
    return res.status(404).json({
      success: false,
      message: "No items in the wishlist",
      wishlistItems: [],
    });
  }

  res.status(200).json({
    success: true,
    wishlistItems,
    message: "Successfully added to wishlist",
  });
});

const deleteWishList = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { wishlistId } = req.body;

  if (!userId || !wishlistId) {
    return res.status(400).json({ success: false, message: "Invalid inputs" });
  }

  const deletedProduct = await Wishlist.findOneAndDelete({ _id: wishlistId });

  if (!deletedProduct) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found in wishlist" });
  }

  res
    .status(200)
    .json({ success: true, message: "Product removed from wishlist" });
});

module.exports = { deleteWishList, postWishList, getWishList };
