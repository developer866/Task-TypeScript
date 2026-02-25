// src/pages/TrackOrder.tsx - Add history button at the top
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { toast } from "react-toastify";

interface TrackingDetail {
  status: string;
  description: string;
  timestamp: string;
}

interface Order {
  orderId: string;
  items: any[];
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  trackingDetails: TrackingDetail[];
  createdAt: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

function TrackOrder() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const token = useAppSelector((state) => state.auth.token); // ✅ Get token
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchOrderId, setSearchOrderId] = useState(orderId || "");

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId);
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const fetchOrder = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/orders/track/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Order not found");
      }

      setOrder(data.order);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Failed to fetch order");
      }
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchOrderId.trim()) {
      navigate(`/track-order/${searchOrderId.trim()}`);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      processing: "bg-purple-100 text-purple-800",
      shipped: "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getPaymentStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      completed: "text-green-600",
      pending: "text-yellow-600",
      failed: "text-red-600",
    };
    return colors[status] || "text-gray-600";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* ✅ Header with History Button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
            <p className="text-gray-600">Enter your order ID to check status</p>
          </div>
          
          {/* ✅ Show History Button only if logged in */}
          {token && (
            <button
              onClick={() => navigate("/order-history")}
              className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Order History
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              type="text"
              value={searchOrderId}
              onChange={(e) => setSearchOrderId(e.target.value)}
              placeholder="Enter your Order ID (e.g., ORD-xxxxx-xxxxx)"
              className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Track
            </button>
          </form>
        </div>

        {/* Order Details */}
        {order && (
          <div className="space-y-6">
            
            {/* Order Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Order {order.orderId}</h2>
                  <p className="text-sm text-gray-600">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-4 py-2 rounded-full font-semibold capitalize ${getStatusColor(order.orderStatus)}`}>
                  {order.orderStatus}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-semibold capitalize">
                    {order.paymentMethod.replace("_", " ")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <p className={`font-semibold capitalize ${getPaymentStatusColor(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="font-semibold text-xl">${order.totalAmount.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-4">Shipping Address</h3>
                <p className="text-gray-700">
                  {order.shippingAddress.street}<br />
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                  {order.shippingAddress.country}
                </p>
              </div>
            )}

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">Order Items</h3>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-3 border-b last:border-b-0">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-6">Order Timeline</h3>
              <div className="relative">
                {order.trackingDetails.map((detail, index) => (
                  <div key={index} className="flex gap-4 pb-8 last:pb-0">
                    <div className="relative flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full ${
                        detail.status === order.orderStatus 
                          ? "bg-blue-600" 
                          : "bg-gray-300"
                      }`} />
                      {index !== order.trackingDetails.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-300 absolute top-4" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-semibold capitalize">{detail.status}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(detail.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600">{detail.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {!order && !loading && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg
              className="w-16 h-16 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No order found</h3>
            <p className="text-gray-600">Enter your Order ID above to track your order</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TrackOrder;