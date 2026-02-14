import { Route, Routes } from "react-router-dom";
import RegisterUser from "./pages/RegisterUser";
import Taskpage from "./pages/Taskpage";
import "./App.css";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <main>
      <Routes>
        <Route path="/register" element={<RegisterUser />} />
        <Route path="/taskpage" element={<Taskpage />} />
      </Routes>
      <ToastContainer />
    </main>
  );
}

export default App;
