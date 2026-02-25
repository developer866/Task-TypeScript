// src/pages/AdminOrders.tsx
import { useState, useEffect } from "react";
import { useAppSelector } from "../../app/hooks";
import { toast } from "react-toastify";

interface Order {
  _id: string;
  orderId: string;
  user?: { name: string; email: string }; // ✅ Make user optional
  guestInfo?: { name: string; email: string; phone: string }; // ✅ Add guestInfo
  isGuest: boolean; // ✅ Add isGuest flag
  items: unknown[];
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
}

function AdminOrders() {
  const token = useAppSelector((state) => state.auth.token);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [statusDescription, setStatusDescription] = useState<string>("");

  useEffect(() => {
    fetchOrders();
  }, [filter]); // ✅ Re-fetch when filter changes

  const fetchOrders = async () => {
    try {
      setLoading(true);
      let url = "http://localhost:5000/api/orders/admin/all";
      if (filter !== "all") {
        url += `?orderStatus=${filter}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch orders");
      }

      setOrders(data.orders);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Failed to fetch orders");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTracking = async (orderId: string) => {
    if (!newStatus) {
      toast.error("Please select a status");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/admin/${orderId}/tracking`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
            description: statusDescription || undefined,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update order");
      }

      toast.success("Order status updated successfully");
      setSelectedOrder(null);
      setNewStatus("");
      setStatusDescription("");
      fetchOrders();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Failed to update order");
      }
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
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Order Management</h1>

          {/* Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {order.orderId}
                  </td>
                  
                  {/* ✅ FIXED: Handle both guest and registered users */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div>
                      {order.isGuest && order.guestInfo ? (
                        <>
                          <p className="font-medium">{order.guestInfo.name}</p>
                          <p className="text-gray-500 text-xs">{order.guestInfo.email}</p>
                          <p className="text-gray-500 text-xs">{order.guestInfo.phone}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                            Guest
                          </span>
                        </>
                      ) : order.user ? (
                        <>
                          <p className="font-medium">{order.user.name}</p>
                          <p className="text-gray-500 text-xs">{order.user.email}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Member
                          </span>
                        </>
                      ) : (
                        <p className="text-gray-500 text-xs">N/A</p>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    ${order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`capitalize ${
                        order.paymentStatus === "completed"
                          ? "text-green-600"
                          : order.paymentStatus === "pending"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full capitalize ${getStatusColor(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => {
                        setSelectedOrder(order.orderId);
                        setNewStatus(order.orderStatus);
                      }}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {orders.length === 0 && (
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">
              {filter === "all" 
                ? "No orders have been placed yet."
                : `No orders with status "${filter}".`}
            </p>
          </div>
        )}

        {/* Update Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Update Order Status</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    value={statusDescription}
                    onChange={(e) => setStatusDescription(e.target.value)}
                    placeholder="Add a note about this status update"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    rows={3}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleUpdateTracking(selectedOrder)}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => {
                      setSelectedOrder(null);
                      setNewStatus("");
                      setStatusDescription("");
                    }}
                    className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrders;