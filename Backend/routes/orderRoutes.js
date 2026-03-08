// backend/routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const {
  placeOrder,
  verifyPayment, // ✅ Import
  getUserOrders,
  trackOrder,
  getAllOrders,
  updateOrderTracking,
  updatePaymentStatus,
} = require("../controller/orderController");

const auth = require("../middleware/auth");
// const admin = require("../middleware/admin");

const jwt = require("jsonwebtoken");
const optionalAuth = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = decoded;
      } catch (err) {
        // Invalid token - treat as guest
      }
    }
    next();
  } catch (error) {
    next();
  }
};

// ========== PUBLIC/GUEST ROUTES ==========
router.post("/", optionalAuth, placeOrder);
router.get("/track/:orderId", trackOrder);
router.get("/verify-payment/:reference", verifyPayment); // ✅ Add this

// ========== USER ROUTES (Auth Required) ==========
router.get("/my-orders", auth, getUserOrders);

// ========== ADMIN ROUTES ==========
router.get("/admin/all", auth, getAllOrders);
router.put("/admin/:orderId/tracking", auth, updateOrderTracking);
router.put("/admin/:orderId/payment", auth, updatePaymentStatus);

module.exports = router;
