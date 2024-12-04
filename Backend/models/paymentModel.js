const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  razorpay_order_id: {
    type: String,
    required: true,
  },
  razorpay_payment_id: {
    type: String,
    required: true,
  },
  razorpay_signature: {
    type: String,
    required: true,
  },
<<<<<<< HEAD
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    // required: true,
  },
=======
  // userId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User",
  //   required: true,
  // },
>>>>>>> cbf5890e020779475066abe4027a5b702e2cb306
  amount:{
    type:Number,
    required:true
  }
}, { timestamps: true });

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;