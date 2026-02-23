// src/pages/Checkout.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { clearCart } from "../features/cart/cartSlice";
import { toast } from "react-toastify";

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// ✅ Add GuestInfo interface
interface GuestInfo {
  name: string;
  email: string;
  phone: string;
}

function Checkout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items, totalPrice } = useAppSelector((state) => state.cart);
  const token = useAppSelector((state) => state.auth.token);

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cash_on_delivery">("online");
  
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  // ✅ Add guest info state
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({
    name: "",
    email: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Add guest info handler
  const handleGuestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuestInfo({
      ...guestInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    // ✅ Validate guest info if not logged in
    if (!token && (!guestInfo.name || !guestInfo.email || !guestInfo.phone)) {
      toast.error("Please fill in your contact information");
      return;
    }

    setIsProcessing(true);

    try {
      const orderItems = items.map((item) => ({
        productId: item._id,
        name: item.name,
        quantity: item.quantity,
      }));

      // ✅ Prepare request body
      const requestBody: {
        items: typeof orderItems;
        shippingAddress: ShippingAddress;
        paymentMethod: string;
        guestInfo?: GuestInfo;
      } = {
        items: orderItems,
        shippingAddress,
        paymentMethod,
      };

      // ✅ Add guestInfo if not logged in
      if (!token) {
        requestBody.guestInfo = guestInfo;
      }

      // ✅ Prepare headers
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      // ✅ Add token only if logged in
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers,
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to place order");
      }

      dispatch(clearCart());
      toast.success("Order placed successfully!");
      navigate(`/track-order/${data.orderId}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Failed to place order");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <button
            onClick={() => navigate("/Product")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            
            {/* ✅ Guest Contact Info (only show if not logged in) */}
            {!token && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Full Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={guestInfo.name}
                      onChange={handleGuestChange}
                      required
                      placeholder="John Doe"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Email <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={guestInfo.email}
                      onChange={handleGuestChange}
                      required
                      placeholder="john@example.com"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Phone <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={guestInfo.phone}
                      onChange={handleGuestChange}
                      required
                      placeholder="+1234567890"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ✅ Show logged-in user info */}
            {token && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  ✓ <strong>You're logged in</strong> - Your order will be saved to your account
                </p>
              </div>
            )}

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
              <form onSubmit={handlePlaceOrder} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Street <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={shippingAddress.street}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      City <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      State <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={shippingAddress.state}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Zip Code <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={shippingAddress.zipCode}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Country <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={shippingAddress.country}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              <div className="space-y-3">
                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                  paymentMethod === "online" ? "border-blue-600 bg-blue-50" : ""
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={(e) => setPaymentMethod(e.target.value as "online")}
                    className="w-5 h-5 text-blue-600"
                  />
                  <div className="ml-3">
                    <p className="font-semibold">Pay Online</p>
                    <p className="text-sm text-gray-600">
                      Pay securely with your card
                    </p>
                  </div>
                </label>

                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                  paymentMethod === "cash_on_delivery" ? "border-blue-600 bg-blue-50" : ""
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash_on_delivery"
                    checked={paymentMethod === "cash_on_delivery"}
                    onChange={(e) => setPaymentMethod(e.target.value as "cash_on_delivery")}
                    className="w-5 h-5 text-blue-600"
                  />
                  <div className="ml-3">
                    <p className="font-semibold">Cash on Delivery</p>
                    <p className="text-sm text-gray-600">
                      Pay when you receive your order
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
            >
              {isProcessing ? "Processing..." : "Place Order"}
            </button>

            {/* ✅ Login suggestion for guests */}
            {!token && (
              <p className="text-center text-sm text-gray-600">
                Have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Login to track orders easily
                </button>
              </p>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    {item.name} x {item.quantity}
                  </span>
                  <span className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
            </div>
            <div className="border-t pt-3 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;