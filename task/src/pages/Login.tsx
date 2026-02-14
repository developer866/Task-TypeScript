import { useState } from "react";

function Login() {
  const [formdData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...FormData, [e.target.name]: e.target.value });
  };
  return (
    <main>
      <form className="w-1/2">
        <div>
          <label htmlFor="email">email or username</label>
          <input
            type="text"
            placeholder="Username or Email"
            name="name"
            className="w-full flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-700 bg-gray-50 border
        border-gray-300 rounded-lg focus:outline-none focus:ring-2
        focus:ring-blue-500 focus:border-transparent placeholder-gray-400
        transition-all duration-200"
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="email">email or username</label>
          <input
            type="text"
            placeholder="Password"
            className="w-full flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-700 bg-gray-50 border
        border-gray-300 rounded-lg focus:outline-none focus:ring-2
        focus:ring-blue-500 focus:border-transparent placeholder-gray-400
        transition-all duration-200"
          />
        </div>
      </form>
    </main>
  );
}

export default Login;
