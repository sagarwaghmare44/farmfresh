import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { FaShoppingCart, FaUserShield } from "react-icons/fa";
import PropTypes from 'prop-types';
import logo from '../assets/Farm.png';

function Navbar({ userType = 'none' }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const getNavItems = () => {
    const commonItems = [
      { to: "/", label: "Home" },
      { to: "/about", label: "About" },
    ];

    switch (userType) {
      case 'user':
        return [
          ...commonItems,
          { to: "/user-products", label: "Shop" },
          { to: "/cart", label: "Cart", icon: <FaShoppingCart className="text-lg mr-2" /> },
          { to: "/user-dashboard", label: "Profile" },
        ];
      case 'farmer':
        return [
          ...commonItems,
          { to: "/add-products", label: "Add Products" },
          { to: "/my-products", label: "My Products" },
          { to: "/farmer-dashboard", label: "Dashboard" },
        ];
      case 'admin':
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
    <nav className="fixed top-0 left-0 right-0 flex justify-between items-center px-6 h-20 shadow-md bg-white z-50">
      <div>
        <NavLink to={userType === 'admin' ? "/manage-users" : "/"}>
          <img src={logo} alt="Farm2Kitchen Logo" className="h-20" />
        </NavLink>
      </div>

      <div className="md:hidden">
        <button onClick={toggleMenu} className="text-gray-700 focus:outline-none">
          {isMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      <div
        className={`fixed inset-0 z-40 bg-white transition-transform transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } md:relative md:translate-x-0`}
      >
        <div className="flex justify-end p-4 md:hidden">
          <button onClick={toggleMenu} className="text-gray-700 focus:outline-none text-3xl" />
        </div>

        <ul className="flex flex-col items-center space-y-4 p-4 mt-16 md:flex-row md:space-y-0 md:space-x-8 md:mt-0">
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
                {item.icon}{item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {!userType || userType === 'none' ? (
        <div className="hidden md:flex space-x-4">
          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive
                ? "bg-green-500 text-white font-semibold rounded-lg px-4 py-2"
                : "text-gray-700 hover:bg-green-500 hover:text-white rounded-lg px-4 py-2 transition duration-300"
            }
          >
            Login
          </NavLink>
          <NavLink
            to="/signup"
            className={({ isActive }) =>
              isActive
                ? "bg-green-500 text-white font-semibold rounded-lg px-4 py-2"
                : "text-gray-700 hover:bg-green-500 hover:text-white rounded-lg px-4 py-2 transition duration-300"
            }
          >
            Sign Up
          </NavLink>
        </div>
      ) : (
        <div className="hidden md:flex space-x-4">
          <button
            onClick={() => {
              window.location.href = '/login';
            }}
            className="text-gray-700 hover:bg-green-500 hover:text-white rounded-lg px-4 py-2 transition duration-300"
          >
            Logout
          </button>
        </div>
      )}

      {userType === 'none' && (
        <Link
          to="/admin-register"
          className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
          title="Admin Registration"
        >
          <FaUserShield size={24} />
        </Link>
      )}
    </nav>
  );
}

Navbar.propTypes = {
  userType: PropTypes.oneOf(['none', 'user', 'farmer', 'admin'])
};

export default Navbar;
