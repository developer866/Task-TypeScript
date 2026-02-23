// src/pages/MyOrders.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { toast } from "react-toastify";

interface OrderItem {
  name: string;
  quantity: number;
}

interface Order {
  _id: string;
  orderId: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
}

function MyOrders() {
  const navigate = useNavigate();
  const token = useAppSelector((state) => state.auth.token);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/orders/my-orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch orders");
        }

        setOrders(data.orders);
      } catch (error: unknown) {
        if (error instanceof Error)
          toast.error(error.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, navigate]);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        {orders.length === 0 ? (
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
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No orders yet
            </h3>
            <p className="text-gray-600 mb-4">
              Start shopping to place your first order
            </p>
            <button
              onClick={() => navigate("/Product")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold">Order {order.orderId}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusColor(order.orderStatus)}`}
                  >
                    {order.orderStatus}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      {item.name} x {item.quantity}
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-xl font-bold">
                      ${order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/track-order/${order.orderId}`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Track Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrders;
