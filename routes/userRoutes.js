const express = require("express");
const { getUser, patchUser } = require("../controller/userController");
const {
  getCart,
  postCart,
  patchCart,
  deleteCart,
} = require("../controller/cartController");
const {
  postWishList,
  getWishList,
  deleteWishList,
} = require("../controller/wishlistController");
const {
  getAddress,
  postAddress,
  patchAddress,
  deleteAddress,
} = require("../controller/addressController");
const { getOrders, postOrder } = require("../controller/orderController");
const router = express.Router();

// GET route to retrieve the user's profile information and PATCH route to update the user's profile
router.route("/:userId").get(getUser).patch(patchUser);

// Routes related to user addresses
router
  .route("/:userId/address")
  .get(getAddress) // GET route to retrieve user's addresses
  .post(postAddress) // POST route to add a new address
  .patch(patchAddress) // PATCH route to update an address
  .delete(deleteAddress); // DELETE route to delete an address

// GET route to retrieve the user's order history
router.get("/:userId/orders", getOrders);

// POST route to initiate the checkout process and place an order
router.post("/:userId/checkout", postOrder);

// Routes related to the user's shopping cart
router
  .route("/:userId/cart")
  .get(getCart) // GET route to retrieve the user's shopping cart
  .post(postCart) // POST route to add a product to the cart
  .patch(patchCart) // PATCH route to update the quantity or details of a product in the cart
  .delete(deleteCart);

router
  .route("/:userId/wishlist")
  .post(postWishList) // Add a product to the wishlist
  .get(getWishList) // Get wishlist items for a user
  .delete(deleteWishList); // DELETE a product from the wishlist

module.exports = router;
