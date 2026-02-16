import { Route, Routes } from "react-router-dom";
import RegisterUser from "./pages/RegisterUser";
import Taskpage from "./pages/Taskpage";
import "./App.css";
import { ToastContainer } from "react-toastify";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <main>
      <Navbar />
      <Routes>
        <Route
          path="/taskpage"
          element={
            <ProtectedRoute>
              <Taskpage />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterUser />} />
      </Routes>
      <ToastContainer />
    </main>
  );
}

export default App;
