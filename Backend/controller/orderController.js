// backend/controllers/orderController.js
const Order = require("../models/order");
const Product = require("../models/product");
const mongoose = require("mongoose");
const paystackService = require("../services/payment");

// ✅ Place Order
const placeOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { items, shippingAddress, paymentMethod, guestInfo } = req.body;

    const userId = req.user?.id || null;
    const isGuest = !userId;

    // ─── Validation ──────────────────────────────────────────
    if (isGuest) {
      if (!guestInfo?.name || !guestInfo?.email || !guestInfo?.phone) {
        await session.abortTransaction();
        return res.status(400).json({
          message: "Guest information (name, email, phone) is required",
        });
      }
    }

    if (!items || items.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Cart is empty" });
    }

    if (!["online", "cash_on_delivery"].includes(paymentMethod)) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Invalid payment method" });
    }

    // ─── Stock check & order items ───────────────────────────
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId).session(session);

      if (!product) {
        await session.abortTransaction();
        return res.status(404).json({ message: `Product ${item.name} not found` });
      }

      // ✅ Handle both 'available' and 'avaliable' (typo in your DB)
      const isAvailable = product.available ?? product.avaliable ?? false;
      if (!isAvailable) {
        await session.abortTransaction();
        return res.status(400).json({ message: `Product ${product.name} is not available` });
      }

      if (product.stock < item.quantity) {
        await session.abortTransaction();
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}. Only ${product.stock} available`,
        });
      }

      product.stock -= item.quantity;
      if (product.stock === 0) {
        product.available = false;
        if (product.avaliable !== undefined) product.avaliable = false;
      }

      await product.save({ session });

      orderItems.push({
        product: product._id,
        name:     product.name,
        price:    product.price,
        quantity: item.quantity,
      });

      totalAmount += product.price * item.quantity;
    }

    // ─── Generate order ID ───────────────────────────────────
    const timestamp = Date.now().toString(36).toUpperCase();
    const random    = Math.random().toString(36).substr(2, 5).toUpperCase();
    const orderId   = `ORD-${timestamp}-${random}`;

    // ─── Paystack initialisation (online only) ───────────────
    let paystackReference        = null;
    let paystackAccessCode       = null;
    let paystackAuthorizationUrl = null;

    if (paymentMethod === "online") {
      const customerEmail = isGuest ? guestInfo.email : req.user.email;
      const customerName  = isGuest ? guestInfo.name  : req.user.name;

      const paymentInit = await paystackService.initializePayment(
        customerEmail,
        totalAmount,
        orderId,
        {
          customer_name: customerName,
          items: orderItems.map((i) => ({
            name: i.name, quantity: i.quantity, price: i.price,
          })),
        }
      );

      if (!paymentInit.success) {
        await session.abortTransaction();
        return res.status(400).json({
          message: `Payment initialization failed: ${paymentInit.message}`,
        });
      }

      paystackReference        = paymentInit.data.reference;
      paystackAccessCode       = paymentInit.data.access_code;
      paystackAuthorizationUrl = paymentInit.data.authorization_url;
    }

    // ─── Build order document ────────────────────────────────
    const trackingMessage =
      paymentMethod === "online"
        ? "Order placed – awaiting payment confirmation"
        : "Order placed – cash on delivery";

    const orderData = {
      orderId,
      items:       orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentStatus: "pending",
      isGuest,
      // ✅ Always include Paystack fields (null for COD)
      // They MUST exist in your Order schema — see order.js
      paystackReference,
      paystackAccessCode,
      paystackAuthorizationUrl,
      trackingDetails: [{ status: "pending", description: trackingMessage }],
    };

    if (userId)  orderData.user      = userId;
    if (isGuest) orderData.guestInfo = guestInfo;

    // ─── Save to DB ──────────────────────────────────────────
    const order = await Order.create([orderData], { session });

    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderId: order[0].orderId,
      order:   order[0],
      ...(paymentMethod === "online" && {
        payment: {
          authorizationUrl: paystackAuthorizationUrl,
          accessCode:       paystackAccessCode,
          reference:        paystackReference,
        },
      }),
    });

  } catch (error) {
    await session.abortTransaction();

    // ✅ Log the FULL error so you can see exactly what failed
    console.error("❌ placeOrder error:", error);

    // ✅ Return validation errors clearly (Mongoose ValidationError)
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }

    // ✅ Duplicate key (e.g. orderId collision — extremely rare)
    if (error.code === 11000) {
      return res.status(400).json({ message: "Duplicate order ID, please try again" });
    }

    return res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

// ✅ Verify Paystack Payment
const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    const order = await Order.findOne({ paystackReference: reference });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.paymentStatus === "completed") {
      return res.status(200).json({ success: true, message: "Payment already verified", order });
    }

    const verification = await paystackService.verifyPayment(reference);
    if (!verification.success) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    const { status, amount } = verification.data;

    if (status === "success") {
      const expectedAmount = Math.round(order.totalAmount * 100);
      if (amount !== expectedAmount) {
        return res.status(400).json({ message: "Payment amount mismatch" });
      }

      order.paymentStatus = "completed";
      order.orderStatus   = "confirmed";
      order.trackingDetails.push({
        status:      "confirmed",
        description: "Payment received successfully",
      });
      await order.save();

      return res.status(200).json({ success: true, message: "Payment verified successfully", order });
    } else {
      order.paymentStatus = "failed";
      order.trackingDetails.push({
        status:      "pending",
        description: "Payment verification failed",
      });
      await order.save();

      return res.status(400).json({ success: false, message: "Payment was not successful", order });
    }
  } catch (error) {
    console.error("❌ verifyPayment error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// ✅ Get My Orders (logged-in users)
const getUserOrders = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const orders = await Order.find({ user: req.user.id, isGuest: false })
      .sort({ createdAt: -1 })
      .populate("items.product");

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("❌ getUserOrders error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// ✅ Track Order by orderId (public)
const trackOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId })
      .populate("items.product", "name")
      .select("-user");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const response = {
      orderId:         order.orderId,
      items:           order.items,
      totalAmount:     order.totalAmount,
      paymentMethod:   order.paymentMethod,
      paymentStatus:   order.paymentStatus,
      orderStatus:     order.orderStatus,
      trackingDetails: order.trackingDetails,
      shippingAddress: order.shippingAddress,
      createdAt:       order.createdAt,
    };
    if (order.isGuest) response.guestInfo = order.guestInfo;

    return res.status(200).json({ success: true, order: response });
  } catch (error) {
    console.error("❌ trackOrder error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// ✅ Admin: Get all orders
const getAllOrders = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const { paymentStatus, orderStatus, paymentMethod } = req.query;
    const filter = {};
    if (paymentStatus)  filter.paymentStatus  = paymentStatus;
    if (orderStatus)    filter.orderStatus    = orderStatus;
    if (paymentMethod)  filter.paymentMethod  = paymentMethod;

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .populate("items.product", "name");

    return res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    console.error("❌ getAllOrders error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// ✅ Admin: Update order tracking
const updateOrderTracking = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const { orderId } = req.params;
    const { status, description } = req.body;

    const validStatuses = ["pending", "confirmed", "processing", "shipped", "delivered"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findOne({ orderId });
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.orderStatus = status;
    order.trackingDetails.push({
      status,
      description: description || `Order status updated to ${status}`,
      updatedBy:   req.user.id,
    });
    await order.save();

    return res.status(200).json({ success: true, message: "Order tracking updated", order });
  } catch (error) {
    console.error("❌ updateOrderTracking error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// ✅ Admin: Update payment status
const updatePaymentStatus = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const { orderId } = req.params;
    const { paymentStatus } = req.body;

    const validStatuses = ["pending", "completed", "failed"];
    if (!validStatuses.includes(paymentStatus)) {
      return res.status(400).json({ message: "Invalid payment status" });
    }

    const order = await Order.findOne({ orderId });
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.paymentStatus = paymentStatus;
    order.trackingDetails.push({
      status:      order.orderStatus,
      description: `Payment status updated to ${paymentStatus}`,
      updatedBy:   req.user.id,
    });
    await order.save();

    return res.status(200).json({ success: true, message: "Payment status updated", order });
  } catch (error) {
    console.error("❌ updatePaymentStatus error:", error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  placeOrder,
  getUserOrders,
  verifyPayment,
  trackOrder,
  getAllOrders,
  updateOrderTracking,
  updatePaymentStatus,
};