import { useState } from "react";
import { LoginApi } from "../Api/LoginApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../features/auth/authSlice";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!formData.email || !formData.password) {
        toast.error("Fields cannot be empty");
        return;
      }
      const data = await LoginApi(formData);
      dispatch(
        loginSuccess({
          user: data.user,
          token: data.token,
        }),
      );
      navigate("/taskpage");
    } catch (error: Error) {
      toast(error.message);
    }
  };
  return (
    <main>
      <form
        className="w-full max-w-md mx-auto p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6"
        onSubmit={handleSubmit}
      >
        <div>
          <label htmlFor="email">email</label>
          <input
            type="text"
            placeholder="Email"
            name="email"
            className="w-full flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-700 bg-gray-50 border
        border-gray-300 rounded-lg focus:outline-none focus:ring-2
        focus:ring-blue-500 focus:border-transparent placeholder-gray-400
        transition-all duration-200"
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            placeholder="Password"
            name="password"
            className="w-full flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-700 bg-gray-50 border
        border-gray-300 rounded-lg focus:outline-none focus:ring-2
        focus:ring-blue-500 focus:border-transparent placeholder-gray-400
        transition-all duration-200"
            onChange={handleChange}
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white text-sm sm:text-base font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
        >
          Login
        </button>
      </form>
    </main>
  );
}

export default Login;
