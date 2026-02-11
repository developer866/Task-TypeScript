import { Route, Routes } from "react-router-dom";
import RegisterUser  from "./pages/RegisterUser";
import Taskpage from "./pages/Taskpage";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/register" element={<RegisterUser />} />
      <Route path="/taskpage" element={<Taskpage />} />
    </Routes>
  );
}

export default App;
