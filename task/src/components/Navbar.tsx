import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { logout } from "../features/auth/authSlice";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { useAppSelector } from "../app/hooks";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.auth.token);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartItemCount = useAppSelector((state) => state.cart.totalItems);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/Login");
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo Section */}
          <div className="shrink-0">
            <NavLink to="/" onClick={closeMobileMenu}>
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 hover:text-blue-600 transition-colors cursor-pointer">
                Clothing Store
              </h1>
            </NavLink>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <NavLink
              to="/"
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
            <NavLink
              to="/Product"
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
            <NavLink
              to="/Project"
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
            <NavLink
              to="/taskpage"
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
          </div>

          {/* Right Side: Cart + Auth Buttons (Desktop & Mobile) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* 🛒 Cart Icon - Always Visible */}
            <NavLink
              to="/cart"
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                className="w-6 h-6 text-gray-700 hover:text-blue-600 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {/* Cart Badge */}
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </NavLink>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {token ? (
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm lg:text-base hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              ) : (
                <>
                  <NavLink
                    to="/Login"
                    className="px-4 py-2 text-sm lg:text-base font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/Register"
                    className="px-4 py-2 text-sm lg:text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Register
                  </NavLink>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                // Close Icon
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                // Hamburger Icon
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
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-3">
              {/* Mobile Navigation Links */}
              <NavLink
                to="/"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `px-4 py-2 text-base font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/Product"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `px-4 py-2 text-base font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                Shop
              </NavLink>
              <NavLink
                to="/Project"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `px-4 py-2 text-base font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                Collection
              </NavLink>
              <NavLink
                to="/taskpage"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `px-4 py-2 text-base font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                Support
              </NavLink>

              {/* Mobile Auth Buttons */}
              <div className="border-t border-gray-200 pt-4 mt-2 space-y-2">
                {token ? (
                  <button
                    className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 shadow-md"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <NavLink
                      to="/Login"
                      onClick={closeMobileMenu}
                      className="block w-full px-4 py-3 text-center font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200"
                    >
                      Login
                    </NavLink>
                    <NavLink
                      to="/Register"
                      onClick={closeMobileMenu}
                      className="block w-full px-4 py-3 text-center font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md"
                    >
                      Register
                    </NavLink>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
