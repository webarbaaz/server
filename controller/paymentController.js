const asyncHandler = require('express-async-handler');
const Payment = require('../model/payment');

const processPayment = asyncHandler(async (req, res) => {
    const { orderId, amount, paymentMethod, transactionId } = req.body;
    console.log({ orderId, amount, paymentMethod, transactionId });
    if (!orderId || !amount || !paymentMethod || !transactionId) {
      res.status(400).json({ status: false, message: "invalid inputs" });
      return;
    }
  
    // Create a new payment record with status set to 'pending'
    const payment = new Payment({
      orderId,
      amount,
      paymentMethod,
      transactionId,
      status: "pending",
    });
  
    // Save the payment record to the database
    await payment.save();
  
    // Logic for processing the payment
    // This could involve interacting with a payment gateway or processor
  
    // For demonstration purposes, let's assume the payment is successful
    // Update the payment status to 'completed'
    payment.status = "completed";
    await payment.save();
  
    // Update the status of the associated order to 'paid'
    await Order.findByIdAndUpdate({ _id: orderId }, { status: "paid" });
  
    res.status(201).json({ success: true, payment });
  });

module.exports = {processPayment};