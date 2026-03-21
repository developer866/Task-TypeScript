// backend/models/order.js
const mongoose = require("mongoose");

const trackingDetailSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { _id: false }
);

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name:     { type: String,  required: true },
    price:    { type: Number,  required: true },
    quantity: { type: Number,  required: true, min: 1 },
  },
  { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    street:  { type: String, default: "" },
    city:    { type: String, default: "" },
    state:   { type: String, default: "" },
    zipCode: { type: String, default: "" },
    country: { type: String, default: "" },
  },
  { _id: false }
);

const guestInfoSchema = new mongoose.Schema(
  {
    name:  { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },

    // Registered user (null for guests)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Guest order flag
    isGuest: {
      type: Boolean,
      default: false,
    },

    // Guest contact info
    guestInfo: {
      type: guestInfoSchema,
      default: null,
    },

    items: [orderItemSchema],

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    shippingAddress: {
      type: shippingAddressSchema,
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
      default: "pending",
    },

    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },

    // ✅ Paystack fields — these MUST be in the schema or Mongoose
    // strict mode will silently drop them (or throw in strict:throw mode)
    paystackReference: {
      type: String,
      default: null,
    },
    paystackAccessCode: {
      type: String,
      default: null,
    },
    paystackAuthorizationUrl: {
      type: String,
      default: null,
    },

    trackingDetails: {
      type: [trackingDetailSchema],
      default: [],
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model("Order", orderSchema);