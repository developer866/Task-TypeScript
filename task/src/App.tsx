import { Route, Routes } from "react-router-dom";
import RegisterUser from "./pages/RegisterUser";
import Taskpage from "./pages/Taskpage";
import "./App.css";
import { ToastContainer } from "react-toastify";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Admin from "./pages/Admin/Admin";
import ProductClients from "./pages/ProductClients";
import Homepage from "./pages/Homepage";
import Footer from "./components/Footer";

function App() {
  return (
    <main>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />}/>
        <Route
          path="/taskpage"
          element={
            <ProtectedRoute>
              <Taskpage />
            </ProtectedRoute>
          }
        />
        <Route path="/admin" element={<Admin />} />
        <Route path="/product" element={<ProductClients />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterUser />} />
      </Routes>
      <ToastContainer />
      <Footer />
    </main>
  );
}

export default App;
