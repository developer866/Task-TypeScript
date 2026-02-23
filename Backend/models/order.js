// backend/models/order.js
const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: String,
  price: Number,
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["online", "cash_on_delivery"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: function() {
        return this.paymentMethod === "online" ? "completed" : "pending";
      },
    },
    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    trackingDetails: [
      {
        status: {
          type: String,
          enum: ["pending", "confirmed", "processing", "shipped", "delivered"],
        },
        description: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
  },
  { timestamps: true }
);

// Generate unique order ID
orderSchema.pre("save", async function (next) {
  if (!this.orderId) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    this.orderId = `ORD-${timestamp}-${random}`;
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);