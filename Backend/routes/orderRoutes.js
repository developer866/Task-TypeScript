// backend/routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getUserOrders,
  trackOrder,
  cancelOrder,
  getAllOrders,
  updateOrderTracking,
  updatePaymentStatus,
} = require("../controllers/orderController");

// ✅ Import middleware
const auth = require("../middleware/auth");
const optionalAuth = require("../middleware/optionalAuth");
const admin = require("../middleware/admin");

// ========== PUBLIC/GUEST ROUTES ==========
router.post("/", optionalAuth, placeOrder);              // ✅ Guest or logged-in can order
router.get("/track/:orderId", trackOrder);               // ✅ Track order (no auth)

// ========== USER ROUTES (Auth Required) ==========
router.get("/my-orders", auth, getUserOrders);           // ✅ Get my orders (logged-in only)
router.post("/:orderId/cancel", auth, cancelOrder);      // ✅ Cancel order (logged-in only)

// ========== ADMIN ROUTES ==========
router.get("/admin/all", auth, admin, getAllOrders);     // ✅ Get all orders (admin only)
router.put("/admin/:orderId/tracking", auth, admin, updateOrderTracking); // ✅ Update tracking (admin only)
router.put("/admin/:orderId/payment", auth, admin, updatePaymentStatus);  // ✅ Update payment (admin only)

module.exports = router;