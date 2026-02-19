import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { logout } from "../features/auth/authSlice";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.auth.token);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/Login");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
      <main className="flex justify-between items-center  max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        {/* Logo Section */}
        <section className="flex-shrink-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-600 hover:text-gray-700 transition-colors cursor-pointer">
            Clothing Store
          </h1>
        </section>

        {/* Navigation Links */}
        <section className="hidden md:block">
          <ul className="flex items-center gap-6 lg:gap-8">
            <li>
              <NavLink
                to={"/"}
                className={({ isActive }) =>
                  `text-sm lg:text-base font-medium transition-colors duration-200 hover:text-blue-600 ${
                    isActive
                      ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                      : "text-gray-700"
                  }`
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/Product"}
                className={({ isActive }) =>
                  `text-sm lg:text-base font-medium transition-colors duration-200 hover:text-blue-600 ${
                    isActive
                      ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                      : "text-gray-700"
                  }`
                }
              >
                Shop
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/Project"}
                className={({ isActive }) =>
                  `text-sm lg:text-base font-medium transition-colors duration-200 hover:text-blue-600 ${
                    isActive
                      ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                      : "text-gray-700"
                  }`
                }
              >
                Collection
              </NavLink>
            </li>

            <li>
              <NavLink
                to={"/taskpage"}
                className={({ isActive }) =>
                  `text-sm lg:text-base font-medium transition-colors duration-200 hover:text-blue-600 ${
                    isActive
                      ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                      : "text-gray-700"
                  }`
                }
              >
                Support
              </NavLink>
            </li>
          </ul>
        </section>

        {/* Auth Buttons */}
        <section className="flex items-center gap-3">
          {token ? (
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm lg:text-base hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <section className="flex gap-2 sm:gap-3">
              <NavLink
                to={"/Login"}
                className="px-4 py-2 text-sm lg:text-base font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
              >
                Login
              </NavLink>
              <NavLink
                to={"/Register"}
                className="px-4 py-2 text-sm lg:text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Register
              </NavLink>
            </section>
          )}
        </section>

        {/* Mobile Menu Button (Optional - for future mobile menu) */}
        <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </main>
    </nav>
  );
}

export default Navbar;
