import Stripe from "stripe";
import Razorpay from "razorpay";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// STRIPE
export const createStripeIntent = async (amount, currency = "inr") => {
  return stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // paise / cents
    currency,
    payment_method_types: ["card"],
  });
};

export const refundStripePayment = async (transactionId, amount) => {
  return stripe.refunds.create({
    payment_intent: transactionId,
    ...(amount && { amount: Math.round(amount * 100) }), // partial refund if amount passed
  });
};

// RAZORPAY 
export const createRazorpayOrder = async (amount, currency = "INR") => {
  return razorpay.orders.create({
    amount: Math.round(amount * 100),
    currency,
  });
};

export const refundRazorpayPayment = async (paymentId, amount) => {
  return razorpay.payments.refund(paymentId, {
    ...(amount && { amount: Math.round(amount * 100) }),
  });
};

export { stripe };