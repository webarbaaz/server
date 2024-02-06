const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Address = require("../model/address");

const getAddress = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Ensure userId is provided
  if (!userId) {
    res.status(400).json({ success: false, message: "User not found" });
    return;
  }

  const allAddress = await Address.find({ userId });

  if (!allAddress || allAddress.length === 0) {
    res.status(400).json({
      success: false,
      message: "No address were found.",
    });
    return;
  }

  res.status(200).json({
    success: true,
    address: allAddress,
  });
});

const postAddress = asyncHandler(async (req, res) => {
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

  // Check if the address already exists
  const existingAddress = await Address.findOne({ userId, ...address });

  if (existingAddress) {
    return res
      .status(400)
      .json({ success: false, message: "Address already exists" });
  }

  // Create a new address
  const newAddress = new Address({
    userId: new mongoose.Types.ObjectId(userId),
    ...address,
  });

  // Save the new address to the database
  const savedAddress = await newAddress.save();

  res.status(201).json({
    success: true,
    message: "Address added successfully",
    address: savedAddress,
  });
});

const patchAddress = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { addressId, address } = req.body;

  // Ensure userId and addressId are provided
  if (!userId || !addressId) {
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

  const updatedAddress = await Address.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(addressId) },
    { $set: { ...address } },
    { new: true } // To return the updated document
  );

  if (!updatedAddress) {
    return res
      .status(404)
      .json({ success: false, message: "Address not found" });
  }

  res.status(200).json({
    success: true,
    message: "Address updated successfully",
    address: updatedAddress,
  });
});

const deleteAddress = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { addressId } = req.body;

  // Ensure userId and addressId are provided
  if (!userId || !addressId) {
    return res.status(400).json({ success: false, message: "Invalid input" });
  }
  // Find and delete the address
  const deletedAddress = await Address.findOneAndDelete({
    userId: new mongoose.Types.ObjectId(userId),
    _id: new mongoose.Types.ObjectId(addressId),
  });

  if (!deletedAddress) {
    return res
      .status(404)
      .json({ success: false, message: "Address not found" });
  }

  res.status(200).json({
    success: true,
    message: "Address deleted successfully",
    address: deletedAddress,
  });
});

module.exports = { getAddress, postAddress, deleteAddress, patchAddress };
