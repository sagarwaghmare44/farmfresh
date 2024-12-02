import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { FaShoppingCart, FaUserShield, FaBars, FaTimes } from "react-icons/fa";
import PropTypes from "prop-types";
import logo from "../assets/Farm.png";

function Navbar({ userType = "none" }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const getNavItems = () => {
    const commonItems = [
      { to: "/", label: "Home" },
      { to: "/about", label: "About" },
    ];

    switch (userType) {
      case "user":
        return [
          ...commonItems,
          { to: "/user-products", label: "Shop" },
          { to: "/cart", label: "Cart", icon: <FaShoppingCart className="text-lg mr-2" /> },
          { to: "/user-dashboard", label: "Profile" },
        ];
      case "farmer":
        return [
          ...commonItems,
          { to: "/add-products", label: "Add Products" },
          { to: "/my-products", label: "My Products" },
          { to: "/farmer-dashboard", label: "Dashboard" },
        ];
      case "admin":
        return [
          { to: "/manage-users", label: "Manage Users" },
          { to: "/manage-farmers", label: "Manage Farmers" },
          { to: "/manage-products", label: "Manage Products" },
        ];
      default:
        return commonItems;
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="flex items-center justify-between px-6 py-4 md:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Farm2Kitchen Logo" className="h-12" />
          <span className="ml-3 text-xl font-semibold text-green-700">Farm2Kitchen</span>
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleMenu}
          className="text-gray-700 md:hidden focus:outline-none"
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  isActive
                    ? "bg-green-500 text-white font-semibold px-4 py-2 rounded-lg"
                    : "text-gray-700 hover:bg-green-500 hover:text-white px-4 py-2 rounded-lg transition duration-300"
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            </li>
          ))}

          {/* Authentication Buttons */}
          {!userType || userType === "none" ? (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive
                    ? "bg-green-500 text-white font-semibold px-4 py-2 rounded-lg"
                    : "text-gray-700 hover:bg-green-500 hover:text-white px-4 py-2 rounded-lg transition duration-300"
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  isActive
                    ? "bg-green-500 text-white font-semibold px-4 py-2 rounded-lg"
                    : "text-gray-700 hover:bg-green-500 hover:text-white px-4 py-2 rounded-lg transition duration-300"
                }
              >
                Sign Up
              </NavLink>
            </>
          ) : (
            <button
              onClick={() => (window.location.href = "/login")}
              className="text-gray-700 hover:bg-green-500 hover:text-white px-4 py-2 rounded-lg transition duration-300"
            >
              Logout
            </button>
          )}
        </ul>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`fixed inset-0 z-40 bg-white transition-transform transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={toggleMenu}
            className="text-gray-700 focus:outline-none text-3xl"
          >
            <FaTimes />
          </button>
        </div>
        <ul className="flex flex-col items-center space-y-4 mt-10">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                onClick={toggleMenu}
                className={({ isActive }) =>
                  isActive
                    ? "bg-green-500 text-white font-semibold rounded-lg px-4 py-2 flex items-center"
                    : "text-gray-700 hover:bg-green-500 hover:text-white rounded-lg px-4 py-2 flex items-center transition duration-300"
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            </li>
          ))}
          {!userType || userType === "none" ? (
            <>
              <NavLink
                to="/login"
                onClick={toggleMenu}
                className={({ isActive }) =>
                  isActive
                    ? "bg-green-500 text-white font-semibold px-4 py-2 rounded-lg"
                    : "text-gray-700 hover:bg-green-500 hover:text-white px-4 py-2 rounded-lg transition duration-300"
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                onClick={toggleMenu}
                className={({ isActive }) =>
                  isActive
                    ? "bg-green-500 text-white font-semibold px-4 py-2 rounded-lg"
                    : "text-gray-700 hover:bg-green-500 hover:text-white px-4 py-2 rounded-lg transition duration-300"
                }
              >
                Sign Up
              </NavLink>
            </>
          ) : (
            <button
              onClick={() => (window.location.href = "/login")}
              className="text-gray-700 hover:bg-green-500 hover:text-white px-4 py-2 rounded-lg transition duration-300"
            >
              Logout
            </button>
          )}
        </ul>
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  userType: PropTypes.oneOf(["none", "user", "farmer", "admin"]),
};

export default Navbar;
