import Order from "../models/Order.model.js";
import Stripe from "stripe";
import Product from "../models/Product.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      billingAddress,
      payment,
      pricing,
      notes
    } = req.body;

   if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items'
      });
    }

    for(let item of items){
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.name}`
        });
      }
      if (product.inventory.trackInventory && product.inventory.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        });
      }
      item.seller = product.seller;
      item.name = product.name;
      item.image = product.images[0]?.url;

    }

    const order = await Order.create({
      buyer: req.user.id,
      items,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      payment,
      pricing,
      notes: { buyer: notes }
    });

    for(let item of items){
      const product = await Product.findById(item.product);
      if(product.inventory.trackInventory){
        product.inventory.quantity -= item.quantity;
      }
      product.sales += item.quantity;
      await product.save();
    }
    await order.populate('buyer', 'name email phone');
    await order.populate('items.product', 'name images');
    await order.populate('items.seller', 'name shopName email');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
};

export const paymentIntent = async (req, res, ) => {
  const {totalAmount} = req.body;
  if(totalAmount<=0 || !totalAmount){
    return res.status(400).json({ success: false, message: "Invalid amount" });
  }
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount * 100,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).send({ error: error.message });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { status, transactionId } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    order.payment.status = status;
    if (transactionId) order.payment.transactionId = transactionId;
    if (status === 'paid') {
      order.isPaid = true;
      order.payment.paidAt = new Date();
      order.status = 'confirmed';
    }
    await order.save();
    res.json({
      success: true,
      message: 'Payment status updated successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating payment status',
      error: error.message
    });
  }
};

export const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .populate("products.productId", "title price images")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      buyer: req.user._id,
    }).populate("products.productId", "title price images");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      buyer: req.user._id,
    });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending orders can be cancelled",
      });
    }

    order.status = "cancelled";
    await order.save();

    res.status(200).json({ success: true, message: "Order cancelled", order });
  } catch (error) {
    next(error);
  }
};
