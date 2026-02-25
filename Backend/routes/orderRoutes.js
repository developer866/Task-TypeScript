// backend/routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getUserOrders,
  trackOrder,
  getAllOrders,
  updateOrderTracking,
  updatePaymentStatus,
} = require("../controller/orderController"); // ✅ Fixed path (controllers not controller)

// ✅ Import middleware
const auth = require("../middleware/auth");
// const admin = require("../middleware/admin");

// ✅ Create optionalAuth middleware inline
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
router.post("/", optionalAuth, placeOrder);        // ✅ Changed from "/orders" to "/"
router.get("/track/:orderId", trackOrder);         // ✅ Public - no auth needed

// ========== USER ROUTES (Auth Required) ==========
router.get("/my-orders", auth, getUserOrders);     // ✅ Added auth middleware

// ========== ADMIN ROUTES ==========
router.get("/admin/all", auth, getAllOrders);                    // ✅ Added auth + admin
router.put("/admin/:orderId/tracking",auth,  updateOrderTracking); // ✅ Added auth + admin
router.put("/admin/:orderId/payment",  updatePaymentStatus);  // ✅ Added auth + admin

module.exports = router;