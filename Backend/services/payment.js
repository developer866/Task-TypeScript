const Paystack = require("paystack-api");

const paystack = Paystack(process.env.PAYSTACK_SECRET_KEY);

const paystackService = {
  // ✅ Initialize payment
  initializePayment: async (email, amount, orderId, metadata = {}) => {
    try {
      // Paystack expects amount in kobo (multiply by 100)
      const amountInKobo = Math.round(amount * 100);

      const response = await paystack.transaction.initialize({
        email,
        amount: amountInKobo,
        reference: orderId, // Use orderId as reference
        callback_url: `${process.env.FRONTEND_URL}/payment/verify`,
        metadata: {
          orderId,
          ...metadata,
        },
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },

  // ✅ Verify payment
  verifyPayment: async (reference) => {
    try {
      const response = await paystack.transaction.verify({
        reference,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },

  // ✅ Get transaction details
  getTransaction: async (reference) => {
    try {
      const response = await paystack.transaction.get({
        id: reference,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      logger.error("Failed to get transaction", error);
      return {
        success: false,
        message: error.message,
      };
    }
  },
};

module.exports = paystackService;
