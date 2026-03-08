// backend/services/payment.js
const Paystack = require("paystack-api");

const paystackService = {
  // ✅ Initialize payment
  initializePayment: async (email, amount, orderId, metadata = {}) => {
    try {
      console.log("🔄 Initializing Paystack payment...");
      console.log("Email:", email);
      console.log("Amount:", amount, "NGN");
      console.log("Order ID:", orderId);

      // Check if secret key exists
      if (!process.env.PAYSTACK_SECRET_KEY) {
        throw new Error("PAYSTACK_SECRET_KEY is not set in .env file");
      }

      const paystack = Paystack(process.env.PAYSTACK_SECRET_KEY);

      // Paystack expects amount in kobo (multiply by 100)
      const amountInKobo = Math.round(amount * 100);

      const response = await paystack.transaction.initialize({
        email,
        amount: amountInKobo,
        reference: orderId,
        callback_url: `${process.env.FRONTEND_URL}/payment/verify`,
        metadata: {
          orderId,
          ...metadata,
        },
      });

      console.log("✅ Payment initialized successfully");
      console.log("Payment URL:", response.data.authorization_url);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("❌ Paystack initialization failed:", error.message);
      return {
        success: false,
        message: error.message,
      };
    }
  },

  // ✅ Verify payment
  verifyPayment: async (reference) => {
    try {
      console.log("🔄 Verifying payment:", reference);

      if (!process.env.PAYSTACK_SECRET_KEY) {
        throw new Error("PAYSTACK_SECRET_KEY is not set");
      }

      const paystack = Paystack(process.env.PAYSTACK_SECRET_KEY);

      const response = await paystack.transaction.verify({
        reference,
      });

      console.log("✅ Payment verified:", response.data.status);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("❌ Payment verification failed:", error.message);
      return {
        success: false,
        message: error.message,
      };
    }
  },

  // ✅ Get transaction details
  getTransaction: async (reference) => {
    try {
      if (!process.env.PAYSTACK_SECRET_KEY) {
        throw new Error("PAYSTACK_SECRET_KEY is not set");
      }

      const paystack = Paystack(process.env.PAYSTACK_SECRET_KEY);

      const response = await paystack.transaction.get({
        id: reference,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("❌ Failed to get transaction:", error.message);
      return {
        success: false,
        message: error.message,
      };
    }
  },
};

module.exports = paystackService;