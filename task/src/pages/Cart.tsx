// src/pages/Cart.tsx
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../features/cart/cartSlice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function Cart() {
  const dispatch = useAppDispatch();
  const { items, totalItems, totalPrice } = useAppSelector(
    (state) => state.cart
  );

  const handleRemove = (id: string, name: string) => {
    dispatch(removeFromCart(id));
    toast.success(`${name} removed from cart`);
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    dispatch(updateQuantity({ _id: id, quantity: newQuantity }));
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear the cart?")) {
      dispatch(clearCart());
      toast.success("Cart cleared");
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg
            className="w-24 h-24 text-gray-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Start shopping to add items to your cart
          </p>
          <Link
            to="/Product"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600">
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </p>
          </div>
          <button
            onClick={handleClearCart}
            className="px-4 py-2 text-red-600 hover:text-red-700 font-medium transition-colors"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow-md p-4 sm:p-6 flex flex-col sm:flex-row gap-4"
              >
                <div className="w-full sm:w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-4xl">👕</span>
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {item.description}
                  </p>
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-600 text-xs font-semibold rounded capitalize">
                    {item.category}
                  </span>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4">
                  <p className="text-xl font-bold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleQuantityChange(item._id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                      className="w-8 h-8 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item._id, item.quantity + 1)
                      }
                      disabled={item.quantity >= item.stock}
                      className="w-8 h-8 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemove(item._id, item.name)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <button className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 active:scale-95 transition-all duration-300 shadow-md hover:shadow-lg mb-3">
                Proceed to Checkout
              </button>

              <Link
                to="/Product"
                className="block w-full py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 text-center transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;