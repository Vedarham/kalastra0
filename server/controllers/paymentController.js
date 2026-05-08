import crypto from "crypto";
import Order from "../models/Order.model.js";
import { stripe, createStripeIntent, createRazorpayOrder } from "../services/paymentService.js";
import { deductStock, restoreStock } from "../services/stockService.js";

export const createPayment = async (req, res) => {
  try {
    const { orderId, provider } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: "Order not found" });
    }

    if (order.isPaid)
      return res.status(400).json({ 
        success: false,
        message: "Order is already paid" 
    });
    
    if (order.status === "cancelled")
      return res.status(400).json({ 
        success: false,
        message: "Cannot pay for a cancelled order" 
    });

    const { total } = order.pricing;
    const currency = order.payment.currency || "INR";

    if (provider === "card" || provider === "stripe") {
      const intent = await createStripeIntent(total, currency.toLowerCase());

      order.payment.method = provider;
      order.payment.transactionId = intent.id;
      order.payment.amount = total;
      await order.save();

      return res.json({ provider, clientSecret: intent.client_secret });
    }

    if (provider === "razorpay") {
      const rzpOrder = await createRazorpayOrder(total, currency);

      order.payment.method = "razorpay";
      order.payment.transactionId = rzpOrder.id;
      order.payment.amount = total;
      await order.save();

      return res.json({ provider, orderId: rzpOrder.id, amount: rzpOrder.amount, currency });
    }

    res.status(400).json({ 
        success: false,
        message: "Invalid provider. Use: card, stripe, razorpay" 
    });
  } catch (err) {
    res.status(500).json({ 
        success: false,
        message: err.message 
    });
  }
};

export const stripeWebhook = async (req, res) => {
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers["stripe-signature"],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Stripe Webhook Error:", err.message);

    return res.status(400).json({
      success: false,
      message: `Webhook Error: ${err.message}`,
    });
  }

  try {
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;

      const order = await Order.findOne({
        "payment.transactionId": paymentIntent.id,
      });

      if (!order) {
        console.warn("Order not found for payment:", paymentIntent.id);

        return res.json({ received: true });
      }

      if (order.isPaid) {
        return res.json({ received: true });
      }

      order.isPaid = true;
      order.status = "confirmed";

      order.payment.status = "paid";
      order.payment.paidAt = new Date();

      await deductStock(order.items);

      await order.save();

      console.log(`Order ${order._id} payment confirmed`);
    }

    if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object;

      const order = await Order.findOne({
        "payment.transactionId": paymentIntent.id,
      });

      if (order) {
        order.payment.status = "failed";
        await order.save();
      }
    }

    return res.json({ received: true });

  } catch (err) {
    console.error("Webhook Processing Error:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const razorpayWebhook = async (req, res) => {
  const digest = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (digest !== req.headers["x-razorpay-signature"])
    return res.status(400).json({ message: "Invalid signature" });

  if (req.body.event === "payment.captured") {
    const payment = req.body.payload.payment.entity;
    const order   = await Order.findOneAndUpdate(
      { "payment.transactionId": payment.order_id },
      {
        isPaid: true,
        status: "confirmed",
        "payment.status": "paid",
        "payment.paidAt": new Date(),
        "payment.razorpayPaymentId": payment.id,
      },
      { new: true }
    );
    if (order) await deductStock(order.items);
  }

  res.json({ status: "ok" });
};

export const cancelOrder = async (req, res) => {
  try {
    const { orderId, reason } = req.body;
 
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
 
    if (["cancelled", "refunded"].includes(order.status))
      return res.status(400).json({ message: `Order already ${order.status}` });
 
    const isBuyer = order.buyer.toString() === req.user._id.toString();
    if (!isBuyer && req.user.role !== "admin")
      return res.status(403).json({ message: "Not authorised" });
 
    if (order.isPaid) await restoreStock(order.items);
 
    order.status = "cancelled";
    order.cancelledBy = req.user.role === "admin" ? "admin" : "buyer";
    order.cancelReason = reason || "";
    order.cancelledAt = new Date();
    order.items.forEach((i) => (i.status = "cancelled"));
    await order.save();
 
    res.json({ message: "Order cancelled", status: order.status });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};