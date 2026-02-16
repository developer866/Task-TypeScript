import { useState } from "react";
import { registerUser } from "../Api/RegisterApi";
import { toast } from "react-toastify";
import {  useNavigate } from "react-router-dom";
import { loginSuccess } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";

const RegisterUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [errors, setErrors] = useState<string[]>([]);

  const validatePassword = () => {
    const newErrors: string[] = [];

    // if (formData.password.length < 10)
    //   newErrors.push("Password must be at least 10 characters long");

    // if (formData.password.length > 24)
    //   newErrors.push("Password must be at most 24 characters long");

    // if (formData.password.includes(" "))
    //   newErrors.push("Password cannot contain spaces");

    // if (!/[0-9]/.test(formData.password))
    //   newErrors.push("Password must contain at least one number");

    // if (!/[A-Z]/.test(formData.password))
    //   newErrors.push("Password must contain at least one uppercase letter");

    // if (!/[a-z]/.test(formData.password))
    //   newErrors.push("Password must contain at least one lowercase letter");

    // if (formData.password !== formData.confirmPassword)
    //   newErrors.push("Passwords do not match");

    return newErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validatePassword();

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setErrors([]);
      const data = await registerUser(formData);
      toast.success("user create sucessfully");
      dispatch(
        loginSuccess({
          user: data.user,
          token: data.token,
        }),
      );

      navigate("/taskpage");
    } catch (error) {
      setErrors([error.message || "Something went wrong"]);
      toast(error.message);
      console.log(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6"
    >
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 sm:mb-6">
          Register Users
        </h1>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="name"
          className="block text-sm sm:text-base font-medium text-gray-700"
        >
          Name
        </label>
        <input
          name="name"
          className="w-full flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-700 bg-gray-50 border
      border-gray-300 rounded-lg focus:outline-none focus:ring-2
      focus:ring-blue-500 focus:border-transparent placeholder-gray-400
      transition-all duration-200"
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm sm:text-base font-medium text-gray-700"
        >
          Email
        </label>
        <input
          name="email"
          type="email"
          className="w-full flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-700 bg-gray-50 border
        border-gray-300 rounded-lg focus:outline-none focus:ring-2
        focus:ring-blue-500 focus:border-transparent placeholder-gray-400
        transition-all duration-200"
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-sm sm:text-base font-medium text-gray-700"
        >
          Password
        </label>
        <input
          name="password"
          type="password"
          className="w-full flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-700 bg-gray-50 border
        border-gray-300 rounded-lg focus:outline-none focus:ring-2
        focus:ring-blue-500 focus:border-transparent placeholder-gray-400
        transition-all duration-200"
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="confirmPassword"
          className="block text-sm sm:text-base font-medium text-gray-700"
        >
          Confirm Password
        </label>
        <input
          name="confirmPassword"
          type="password"
          className="w-full flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-700 bg-gray-50 border
        border-gray-300 rounded-lg focus:outline-none focus:ring-2
        focus:ring-blue-500 focus:border-transparent placeholder-gray-400
        transition-all duration-200"
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="role"
          className="block text-sm sm:text-base font-medium text-gray-700"
        >
          Role
        </label>
        <select
          name="role"
          onChange={handleChange}
          className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        >
          <option value="">Select Role</option>
          <option value="user">User</option>
          <option value="seller">Seller</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
          <ul className="space-y-1 sm:space-y-2">
            {errors.map((err, index) => (
              <li key={index} className="text-red-600 text-xs sm:text-sm">
                {err}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="submit"
        className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white text-sm sm:text-base font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
      >
        Submit
      </button>
    </form>
  );
};

export default RegisterUser;
