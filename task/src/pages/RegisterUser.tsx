import { useState } from "react";

const RegisterUser = () => {
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

    if (formData.password.length < 10)
      newErrors.push("Password must be at least 10 characters long");

    if (formData.password.length > 24)
      newErrors.push("Password must be at most 24 characters long");

    if (formData.password.includes(" "))
      newErrors.push("Password cannot contain spaces");

    if (!/[0-9]/.test(formData.password))
      newErrors.push("Password must contain at least one number");

    if (!/[A-Z]/.test(formData.password))
      newErrors.push("Password must contain at least one uppercase letter");

    if (!/[a-z]/.test(formData.password))
      newErrors.push("Password must contain at least one lowercase letter");

    if (formData.password !== formData.confirmPassword)
      newErrors.push("Passwords do not match");

    return newErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validatePassword();

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    console.log("Form Submitted:", formData);
  };

  return (
    <form onSubmit={handleSubmit}>
        <div><h1>Registter Users</h1></div>
      <div>
        <label htmlFor="name">name</label>
        <input
          name="name"
          className="flex-1 px-4 py-3 text-gray-700 bg-gray-50 border
      border-gray-300 rounded-lg focus:outline-none focus:ring-2
      focus:ring-blue-500 focus:border-transparent placeholder-gray-400
      transition-all duration-200"
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="name">email</label>
        <input
          name="email"
          type="email"
          className="flex-1 px-4 py-3 text-gray-700 bg-gray-50 border
        border-gray-300 rounded-lg focus:outline-none focus:ring-2
        focus:ring-blue-500 focus:border-transparent placeholder-gray-400
        transition-all duration-200"
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="name">password</label>
        <input
          name="password"
          type="password"
          className="flex-1 px-4 py-3 text-gray-700 bg-gray-50 border
        border-gray-300 rounded-lg focus:outline-none focus:ring-2
        focus:ring-blue-500 focus:border-transparent placeholder-gray-400
        transition-all duration-200"
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="name">Confirm Password</label>
        <input
          name="confirmPassword"
          type="password"
          className="flex-1 px-4 py-3 text-gray-700 bg-gray-50 border
        border-gray-300 rounded-lg focus:outline-none focus:ring-2
        focus:ring-blue-500 focus:border-transparent placeholder-gray-400
        transition-all duration-200"
          onChange={handleChange}
        />
      </div>
      <select name="role" onChange={handleChange}>
        <option value="">Select Role</option>
        <option value="user">User</option>
        <option value="seller">Seller</option>
        <option value="admin">Admin</option>
      </select>
      {errors.length > 0 && (
        <div style={{ color: "red" }}>
          {errors.map((err, index) => (
            <p key={index}>{err}</p>
          ))}
        </div>
      )}
      <button
        type="submit"
        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
      >
        Submit
      </button>
    </form>
  );
};

export default RegisterUser;
