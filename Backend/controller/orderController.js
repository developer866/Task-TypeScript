// backend/controllers/orderController.js
const Order = require("../models/order");
const Product = require("../models/product");
const mongoose = require("mongoose");
const paystackService = require("../services/payment");

// ✅ Place Order with Paystack Integration
const placeOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { items, shippingAddress, paymentMethod, guestInfo } = req.body;

    const userId = req.user?.id || null;
    const isGuest = !userId;

    // Validate guest info
    if (isGuest) {
      if (
        !guestInfo ||
        !guestInfo.name ||
        !guestInfo.email ||
        !guestInfo.phone
      ) {
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

    let totalAmount = 0;
    const orderItems = [];

    // Check stock and prepare order items
    for (const item of items) {
      const product = await Product.findById(item.productId).session(session);

      if (!product) {
        await session.abortTransaction();
        return res.status(404).json({
          message: `Product ${item.name} not found`,
        });
      }

      const isAvailable = product.available ?? product.avaliable ?? false;
      if (!isAvailable) {
        await session.abortTransaction();
        return res.status(400).json({
          message: `Product ${product.name} is not available`,
        });
      }

      if (product.stock < item.quantity) {
        await session.abortTransaction();
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}. Only ${product.stock} available`,
        });
      }

      // Decrease stock
      product.stock -= item.quantity;

      if (product.stock === 0) {
        product.available = false;
        if (product.avaliable !== undefined) {
          product.avaliable = false;
        }
      }

      await product.save({ session });

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });

      totalAmount += product.price * item.quantity;
    }

    // Generate order ID
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    const orderId = `ORD-${timestamp}-${random}`;

    // ✅ Determine payment status
    let paymentStatus = "pending";
    let paystackReference = null;
    let paystackAccessCode = null;
    let paystackAuthorizationUrl = null;

    // ✅ Initialize Paystack payment for online payment
    if (paymentMethod === "online") {
      const customerEmail = isGuest ? guestInfo.email : req.user.email;

      const paymentInit = await paystackService.initializePayment(
        customerEmail,
        totalAmount,
        orderId,
        {
          customer_name: isGuest ? guestInfo.name : req.user.name,
          items: orderItems.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      );

      if (!paymentInit.success) {
        await session.abortTransaction();
        return res.status(400).json({
          message: "Payment initialization failed. Please try again.",
        });
      }

      paystackReference = paymentInit.data.reference;
      paystackAccessCode = paymentInit.data.access_code;
      paystackAuthorizationUrl = paymentInit.data.authorization_url;
    }

    const trackingMessage =
      paymentMethod === "online"
        ? "Order placed - Awaiting payment confirmation"
        : "Order placed - Cash on delivery";

    const orderData = {
      orderId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentStatus,
      isGuest,
      paystackReference,
      paystackAccessCode,
      paystackAuthorizationUrl,
      trackingDetails: [
        {
          status: "pending",
          description: trackingMessage,
        },
      ],
    };

    if (userId) {
      orderData.user = userId;
    }

    if (isGuest) {
      orderData.guestInfo = guestInfo;
    }

    const order = await Order.create([orderData], { session });

    await session.commitTransaction();

    // ✅ Return response with payment URL if online payment
    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderId: order[0].orderId,
      order: order[0],
      // ✅ Include payment URL for frontend redirect
      ...(paymentMethod === "online" && {
        payment: {
          authorizationUrl: paystackAuthorizationUrl,
          accessCode: paystackAccessCode,
          reference: paystackReference,
        },
      }),
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

// ✅ Verify Paystack Payment
const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    // Find order by reference
    const order = await Order.findOne({ paystackReference: reference });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if already verified
    if (order.paymentStatus === "completed") {
      return res.status(200).json({
        success: true,
        message: "Payment already verified",
        order,
      });
    }

    // Verify with Paystack
    const verification = await paystackService.verifyPayment(reference);

    if (!verification.success) {
      return res.status(400).json({
        message: "Payment verification failed",
      });
    }

    const { status, amount } = verification.data;

    // Check if payment was successful
    if (status === "success") {
      // Verify amount matches
      const expectedAmount = Math.round(order.totalAmount * 100); // Convert to kobo
      if (amount !== expectedAmount) {
        return res.status(400).json({
          message: "Payment amount mismatch",
        });
      }

      // Update order
      order.paymentStatus = "completed";
      order.orderStatus = "confirmed";
      order.trackingDetails.push({
        status: "confirmed",
        description: "Payment received successfully",
      });

      await order.save();

    
      res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        order,
      });
    } else {
      // Payment failed
      order.paymentStatus = "failed";
      order.trackingDetails.push({
        status: "pending",
        description: "Payment verification failed",
      });

      await order.save();


      res.status(400).json({
        success: false,
        message: "Payment was not successful",
        order,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get My Orders (Logged-in users only)
const getUserOrders = async (req, res) => {
  try {
    // ✅ FIXED: Check if user exists
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const userId = req.user.id;
    const orders = await Order.find({ user: userId, isGuest: false })
      .sort({ createdAt: -1 })
      .populate("items.product");

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Track Order by Order ID (Public - no auth required)
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
      orderId: order.orderId,
      items: order.items,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      trackingDetails: order.trackingDetails,
      shippingAddress: order.shippingAddress,
      createdAt: order.createdAt,
    };

    if (order.isGuest) {
      response.guestInfo = order.guestInfo;
    }

    res.status(200).json({
      success: true,
      order: response,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ ADMIN: Get All Orders
const getAllOrders = async (req, res) => {
  try {
    // ✅ FIXED: Check if admin
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const { paymentStatus, orderStatus, paymentMethod } = req.query;

    const filter = {};
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (orderStatus) filter.orderStatus = orderStatus;
    if (paymentMethod) filter.paymentMethod = paymentMethod;

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .populate("items.product", "name");

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ ADMIN: Update Order Tracking
const updateOrderTracking = async (req, res) => {
  try {
    // ✅ FIXED: Check if admin
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const { orderId } = req.params;
    const { status, description } = req.body;
    const adminId = req.user.id;

    const validStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.orderStatus = status;
    order.trackingDetails.push({
      status,
      description: description || `Order status updated to ${status}`,
      updatedBy: adminId,
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order tracking updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ ADMIN: Update Payment Status
const updatePaymentStatus = async (req, res) => {
  try {
    // ✅ FIXED: Check if admin
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const { orderId } = req.params;
    const { paymentStatus } = req.body;

    const validStatuses = ["pending", "completed", "failed"];
    if (!validStatuses.includes(paymentStatus)) {
      return res.status(400).json({ message: "Invalid payment status" });
    }

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.paymentStatus = paymentStatus;

    order.trackingDetails.push({
      status: order.orderStatus,
      description: `Payment status updated to ${paymentStatus}`,
      updatedBy: req.user.id,
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
