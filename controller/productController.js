const asyncHandler = require("express-async-handler");
const Product = require("../model/products");
const { default: mongoose } = require("mongoose");

const getProducts = asyncHandler(async (req, res) => {
  // Retrieve all products from the database
  const allProducts = await Product.find();

  res.status(200).json({ products: allProducts });
});

const postProducts = asyncHandler(async (req, res) => {
  const { title, desc, imgs, categories, sizes, colors, price } = req.body;
  const { id: userId } = req.user;

  if (!userId) {
    throw new Error("User not found");
  }
  
  if (!title || !desc || !imgs || !categories || !sizes || !colors || !price) {
    throw new Error("Please Provide all the product details");
  }

  // Create a new product instance
  const newProduct = new Product({
    userId: new mongoose.Types.ObjectId(userId),
    title,
    desc,
    imgs,
    categories,
    sizes,
    colors,
    price,
  });

  // Save the product to the database
  await newProduct.save();

  res
    .status(201)
    .json({ message: "Product added successfully", product: newProduct });
});
// const getProducts = asyncHandler(async (req, res) => {

// })
// const getProducts = asyncHandler(async (req, res) => {

// })

module.exports = { getProducts, postProducts };
