import { NavLink } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import logo from '../assets/Farm.png';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-10">
      <div className="container mx-auto text-center px-4">
        <h1 className="text-3xl md:text-5xl font-bold mb-3">FarmFresh</h1>
        <p className="text-md md:text-lg italic mb-6">“Fresh Produce, Delivered to Your Doorstep!”</p>

        <div className="flex flex-col md:flex-row md:justify-between items-center max-w-5xl mx-auto mt-8 space-y-8 md:space-y-0">
          <div className="flex items-center justify-center md:justify-start">
            <img 
              src={logo} 
              alt="FarmFresh Logo" 
              className="h-16 md:h-20 rounded-md shadow-lg transition-transform duration-300 hover:scale-105" 
            />
          </div>

          <div className="text-center md:text-left">
            <h2 className="text-lg md:text-xl font-semibold mb-2">Explore More</h2>
            <div className="flex flex-col items-center md:items-start">
              <NavLink to="/" className="text-white hover:text-blue-400 my-1 transition-colors duration-200">
                Home
              </NavLink>
              <NavLink to="/products" className="text-white hover:text-blue-400 my-1 transition-colors duration-200">
                Products
              </NavLink>
              <NavLink to="/about" className="text-white hover:text-blue-400 my-1 transition-colors duration-200">
                About
              </NavLink>
            </div>
          </div>

          <div className="text-center md:text-left">
            <h2 className="text-lg md:text-xl font-semibold mb-2">Follow Us</h2>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors duration-200">
                <FaFacebook size={25} />
              </a>
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors duration-200">
                <FaTwitter size={25} />
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors duration-200">
                <FaInstagram size={25} />
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors duration-200">
                <FaLinkedin size={25} />
              </a>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-xs md:text-sm">
            &copy; {new Date().getFullYear()} FarmFresh. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
