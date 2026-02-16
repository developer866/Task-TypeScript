import { Route, Routes } from "react-router-dom";
import RegisterUser from "./pages/RegisterUser";
import Taskpage from "./pages/Taskpage";
import "./App.css";
import { ToastContainer } from "react-toastify";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";

function App() {
  return (
    <main>
      <Navbar />
      <Routes>
        <Route path="/login" element ={<Login />} />
        <Route path="/register" element={<RegisterUser />} />
        <Route path="/taskpage" element={<Taskpage />} />
      </Routes>
      <ToastContainer />
    </main>
  );
}

export default App;
