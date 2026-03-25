// src/pages/PaymentVerification.tsx
import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

function PaymentVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState<"verifying" | "success" | "failed">("verifying");
  const [orderId, setOrderId] = useState<string | null>(null);

  // جلوگیری از اجرای دوباره (React Strict Mode fix)
  const hasVerified = useRef(false);

  const verifyPayment = useCallback(
    async (reference: string) => {
      try {
        const response = await fetch(
          `https://task-typescript.onrender.com/api/orders/verify-payment/${reference}`
        );

        if (!response.ok) {
          throw new Error("Server error");
        }

        const data = await response.json();

        if (data.success) {
          setStatus("success");
          setOrderId(data.order.orderId);
          toast.success("Payment verified successfully!");

          const timer = setTimeout(() => {
            navigate(`/track-order/${data.order.orderId}`);
          }, 3000);

          return () => clearTimeout(timer);
        } else {
          setStatus("failed");
          toast.error("Payment verification failed");
        }
      } catch (error: unknown) {
        setStatus("failed");

        if (error instanceof Error) {
          toast.error(`Error verifying payment: ${error.message}`);
        } else {
          toast.error("Failed to verify payment");
        }
      }
    },
    [navigate]
  );

  useEffect(() => {
    if (hasVerified.current) return; // ✅ prevents double call
    hasVerified.current = true;

    const reference = searchParams.get("reference");

    if (!reference) {
      toast.error("Invalid payment reference");
      navigate("/");
      return;
    }

    verifyPayment(reference);
  }, [searchParams, navigate, verifyPayment]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">

        {/* Verifying */}
        {status === "verifying" && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verifying Payment
            </h2>
            <p className="text-gray-600">
              Please wait while we confirm your payment...
            </p>
          </div>
        )}

        {/* Success */}
        {status === "success" && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h2>

            <p className="text-gray-600 mb-6">
              Your order has been confirmed and payment received.
            </p>

            {orderId && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-1">Order ID</p>
                <p className="text-lg font-bold text-gray-900">{orderId}</p>
              </div>
            )}

            <p className="text-sm text-gray-500">
              Redirecting to order tracking in 3 seconds...
            </p>
          </div>
        )}

        {/* Failed */}
        {status === "failed" && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Failed
            </h2>

            <p className="text-gray-600 mb-6">
              We couldn't verify your payment. Please try again.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => navigate("/")}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Go Home
              </button>

              <button
                onClick={() => navigate("/cart")}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Cart
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default PaymentVerification;