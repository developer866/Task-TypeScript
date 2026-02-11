import { useState } from "react";

const RegisterUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <main>
      <form className="gap-10" onSubmit={handleSubmit}>
        <div>
          <h1 className="text-center text-2xl mb-10">Registering User form</h1>
        </div>
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="flex-1 px-4 py-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition-all duration-200"
            placeholder="name"
            name="name"
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="Email">Email</label>
          <input
            type="text"
            className="flex-1 px-4 py-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition-all duration-200"
            placeholder="Email"
            name="email"
            onChange={handleChange}
            typeof="email"
          />
        </div>
        <div>
          <label htmlFor="password">password</label>
          <input
            type="text"
            className="flex-1 px-4 py-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition-all duration-200"
            placeholder="name"
            name="password"
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm password</label>
          <input
            type="text"
            className="flex-1 px-4 py-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition-all duration-200"
            placeholder="confirm password"
            name="confirmpassword"
            onChange={handleChange}
          />
          {error ? <>there is error</> : <p>there no error</p>}
        </div>
        <div>
          <label htmlFor="Role">Role</label>
          <select name="Role" id="role">
            <option value="user">user</option>
            <option value="user">seller</option>
            <option value="user">admin</option>
          </select>
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
        >
          Submit
        </button>
      </form>
    </main>
  );
};

export default RegisterUser;
