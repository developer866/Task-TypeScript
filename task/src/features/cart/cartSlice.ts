// src/features/cart/cartSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  quantity: number;
  stock: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

// ✅ Load cart from localStorage
const loadCartFromLocalStorage = (): CartState => {
  try {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      return JSON.parse(savedCart);
    }
  } catch (error) {
    console.error("Failed to load cart from localStorage:", error);
  }
  return {
    items: [],
    totalItems: 0,
    totalPrice: 0,
  };
};

// ✅ Save cart to localStorage
const saveCartToLocalStorage = (state: CartState) => {
  try {
    localStorage.setItem("cart", JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save cart to localStorage:", error);
  }
};

// ✅ Initialize with localStorage data
const initialState: CartState = loadCartFromLocalStorage();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, "quantity">>) => {
      const existingItem = state.items.find(
        (item) => item._id === action.payload._id
      );

      if (existingItem) {
        if (existingItem.quantity < existingItem.stock) {
          existingItem.quantity += 1;
        }
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }

      state.totalItems = state.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      state.totalPrice = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // ✅ Save to localStorage after every change
      saveCartToLocalStorage(state);
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
      state.totalItems = state.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      state.totalPrice = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // ✅ Save to localStorage
      saveCartToLocalStorage(state);
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ _id: string; quantity: number }>
    ) => {
      const item = state.items.find((item) => item._id === action.payload._id);
      if (
        item &&
        action.payload.quantity <= item.stock &&
        action.payload.quantity > 0
      ) {
        item.quantity = action.payload.quantity;
      }
      state.totalItems = state.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      state.totalPrice = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // ✅ Save to localStorage
      saveCartToLocalStorage(state);
    },

    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;

      // ✅ Clear localStorage
      localStorage.removeItem("cart");
    },

    // ✅ Optional: Sync cart with fresh product data from API
    syncCartWithProducts: (
      state,
      action: PayloadAction<{ _id: string; stock: number; available: boolean }[]>
    ) => {
      const products = action.payload;
      
      state.items = state.items.filter((item) => {
        const product = products.find((p) => p._id === item._id);
        if (!product || !product.available) {
          return false; // Remove unavailable products
        }
        // Update stock info and adjust quantity if needed
        item.stock = product.stock;
        if (item.quantity > product.stock) {
          item.quantity = product.stock;
        }
        return true;
      });

      // Recalculate totals
      state.totalItems = state.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      state.totalPrice = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // ✅ Save updated cart
      saveCartToLocalStorage(state);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, syncCartWithProducts } =
  cartSlice.actions;
export default cartSlice.reducer;