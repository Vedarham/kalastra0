import Order from "../models/Order.model.js";
import Product from "../models/Product.model.js";

export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, pricing, payment } = req.body;

    if (!items?.length) {
      return res.status(400).json({ success: false, message: "No items in order" });
    }
    const enrichedItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.product);

        if (!product || !product.isActive) {
          throw new Error(`Product ${item.product} not found`);
        }
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }

        // Deduct stock
        product.stock -= item.quantity;
        await product.save();

        return {
          product: product._id,
          seller: product.artisan,
          name: product.name,                        // snapshot
          image: product.images?.[0]?.url || "",     // snapshot
          price: product.price,                      // snapshot
          quantity: item.quantity,
        };
      })
    );

    const order = await Order.create({
      buyer: req.user.id,
      items: enrichedItems,
      shippingAddress,
      pricing,
      payment,
    });

    return res.status(201).json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Buyer's own orders
export const getMyOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = { buyer: req.user.id };
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate("items.product", "name images price")
      .populate("items.seller", "name shopName avatar")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Order.countDocuments(query);

    return res.status(200).json({
      success: true,
      orders,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.product", "name images price")
      .populate("items.seller", "name shopName avatar")
      .populate("buyer", "name email");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const isBuyer = order.buyer._id.toString() === req.user.id;
    const isSeller = order.items.some(i => i.seller._id.toString() === req.user.id);

    if (!isBuyer && !isSeller) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    return res.status(200).json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    if (order.buyer.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }
    if (!["pending", "confirmed"].includes(order.status)) {
      return res.status(400).json({ success: false, message: "Order cannot be cancelled at this stage" });
    }

    order.status = "cancelled";
    order.cancelledBy = "buyer";
    order.cancelReason = req.body.reason || "";
    order.cancelledAt = new Date();

    // Restore stock
    await Promise.all(
      order.items.map(async (item) => {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        });
      })
    );

    await order.save();
    return res.status(200).json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Orders containing partcular seller's products
export const getSellerOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = { "items.seller": req.user.id };
    if (status) query["items.status"] = status;

    const orders = await Order.find(query)
      .populate("buyer", "name email avatar")
      .populate("items.product", "name images price")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Order.countDocuments(query);

    const filtered = orders.map((order) => ({
      ...order.toObject(),
      items: order.items.filter((i) => i.seller.toString() === req.user.id),
    }));

    return res.status(200).json({
      success: true,
      orders: filtered,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update status of seller's own item within an order
export const updateItemStatus = async (req, res) => {
  try {
    const { orderId, itemId } = req.params;
    const { status } = req.body;

    const allowed = ["processing", "confirmed", "cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const item = order.items.id(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }
    if (item.seller.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    item.status = status;

    // Sync top-level order status from all items
    const allStatuses = order.items.map((i) => i.status);
    if (allStatuses.every((s) => s === "confirmed")) order.status = "confirmed";
    else if (allStatuses.every((s) => s === "cancelled")) order.status = "cancelled";
    else if (allStatuses.some((s) => s === "processing")) order.status = "processing";

    await order.save();
    return res.status(200).json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Real stats for seller dashboard
export const getSellerStats = async (req, res) => {
  try {
    const sellerId = req.user.id;

    const orders = await Order.find({
      "items.seller": sellerId,
      "payment.status": "paid",
    });

    let totalRevenue = 0;
    let totalOrders = 0;

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (item.seller.toString() === sellerId) {
          totalRevenue += item.price * item.quantity;
          totalOrders += 1;
        }
      });
    });

    const totalProducts = await Product.countDocuments({
      artisan: sellerId,
      isActive: true,
    });

    // Monthly revenue for chart (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyData = await Order.aggregate([
      {
        $match: {
          "items.seller": sellerId,        
          "payment.status": "paid",
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      { $unwind: "$items" },
      {
        $match: { "items.seller": sellerId },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          orders: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const revenueChart = monthlyData.map((d) => ({
      month: months[d._id.month - 1],
      revenue: d.revenue,
      orders: d.orders,
    }));

    return res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        totalProducts,
        revenueChart,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};