import { Route, Routes } from "react-router-dom";
import RegisterUser from "./pages/RegisterUser";
import Taskpage from "./pages/Taskpage";
import "./App.css";
import { ToastContainer } from "react-toastify";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Admin from "./pages/Admin/Admin";
import Shop from "./pages/ProductClients";
import Homepage from "./pages/Homepage";
import Footer from "./components/Footer";
import Cart from "./pages/Cart";

import Checkout from "./pages/Checkout";
import TrackOrder from "./pages/TrackOrder";
import MyOrders from "./pages/MyOrder";
import AdminOrders from "./pages/Admin/AdminOrders";
import ProductAdmin from "./pages/Admin/ProductAdmin";
import NotFound from "./pages/NotFound";
import OrderHistory from "./pages/OrderHistory";

function App() {
  return (
    <main>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route
          path="/taskpage"
          element={
            <ProtectedRoute>
              <Taskpage />
            </ProtectedRoute>
          }
        />
        <Route path="/admin" element={<Admin />} />
        <Route path="/product" element={<Shop />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterUser />} />
        <Route path="/cart" element={<Cart />} />

        <Route path="/checkout" element={<Checkout />} />
        <Route path="/track-order/:orderId?" element={<TrackOrder />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/products" element={<ProductAdmin />} />
        <Route path="/order-history" element={<OrderHistory />} />

         <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer />
      <Footer />
    </main>
  );
}

export default App;
