// backend/controllers/orderController.js
const Order = require("../models/order");
const Product = require("../models/product");
const mongoose = require("mongoose");

// ✅ USER: Place Order
const placeOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    const userId = req.user.id;

    // Validate
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
          message: `Product ${item.name} not found` 
        });
      }

      const isAvailable = product.available ?? product.avaliable ?? false;
      if (!isAvailable) {
        await session.abortTransaction();
        return res.status(400).json({ 
          message: `Product ${product.name} is not available` 
        });
      }

      if (product.stock < item.quantity) {
        await session.abortTransaction();
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Only ${product.stock} available` 
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

    // Determine payment status based on method
    const paymentStatus = paymentMethod === "online" ? "completed" : "pending";

    // Create order
    const order = await Order.create(
      [
        {
          user: userId,
          items: orderItems,
          totalAmount,
          shippingAddress,
          paymentMethod,
          paymentStatus,
          trackingDetails: [
            {
              status: "pending",
              description: "Order placed successfully",
            },
          ],
        },
      ],
      { session }
    );

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderId: order[0].orderId,
      order: order[0],
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Order placement error:", error);
    res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

// ✅ USER: Get My Orders
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ user: userId })
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

// ✅ USER/PUBLIC: Track Order by Order ID (no auth required)
const trackOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ orderId })
      .populate("items.product", "name")
      .select("-user"); // Don't expose user details publicly

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      order: {
        orderId: order.orderId,
        items: order.items,
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        trackingDetails: order.trackingDetails,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ USER: Cancel Order
const cancelOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({ orderId, user: userId }).session(session);

    if (!order) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Order not found" });
    }

    if (!["pending", "confirmed"].includes(order.orderStatus)) {
      await session.abortTransaction();
      return res.status(400).json({ 
        message: "Cannot cancel order after it has been processed" 
      });
    }

    // Restore stock
    for (const item of order.items) {
      const product = await Product.findById(item.product).session(session);
      if (product) {
        product.stock += item.quantity;
        product.available = true;
        if (product.avaliable !== undefined) {
          product.avaliable = true;
        }
        await product.save({ session });
      }
    }

    order.orderStatus = "cancelled";
    order.trackingDetails.push({
      status: "cancelled",
      description: "Order cancelled by customer",
    });
    await order.save({ session });

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: "Order cancelled and stock restored",
      order,
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

// ========== ADMIN ENDPOINTS ==========

// ✅ ADMIN: Get All Orders
const getAllOrders = async (req, res) => {
  try {
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
    const { orderId } = req.params;
    const { status, description } = req.body;
    const adminId = req.user.id;

    const validStatuses = ["pending", "confirmed", "processing", "shipped", "delivered"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update order status
    order.orderStatus = status;

    // Add tracking detail
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
  trackOrder,
  cancelOrder,
  getAllOrders,
  updateOrderTracking,
  updatePaymentStatus,
};