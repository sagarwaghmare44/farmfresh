import React from 'react';
import { Link } from 'react-router-dom';
import { FiUserPlus } from 'react-icons/fi'; // Icon for "Create Account"
import { AiOutlineShoppingCart } from 'react-icons/ai'; // Icon for "View Products"
import backgroundImage from '../assets/backgroundImage.jpg'; // Adjust the path according to your structure

function FarmToTable() {
  return (
    <div
      className="relative bg-cover bg-center bg-no-repeat min-h-[60vh] md:min-h-[80vh]"
      style={{
        backgroundImage: `url(${backgroundImage})`, // Use your local image
        filter: 'brightness(100%)' // Adjust brightness to 60%
      }}
    >
      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-black opacity-40"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto text-left p-4 md:p-8 lg:p-12">
        <div className="max-w-xl">
          {/* Headings */}
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            Fresh from the farm,
          </h1>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mt-2">
            Delivered to your door
          </h2>
          
          {/* Paragraph */}
          <p className="mt-4 md:mt-6 text-base md:text-lg lg:text-xl text-gray-300 leading-relaxed">
            Experience the convenience of receiving fresh, locally grown produce straight from farmers.
            Farm2Table bridges the gap between farmers and consumers, bringing nature’s finest directly to your home.
            Enjoy the taste of quality, handpicked products while supporting sustainable farming.
          </p>

          {/* Buttons with Routing and Icons */}
          <div className="mt-6 md:mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/signup" className="w-full sm:w-auto">
              <button
                type="button"
                className="w-full px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-semibold rounded-lg 
                         text-white bg-green-600 hover:bg-green-700 transition-colors duration-200
                         flex items-center justify-center"
              >
                <FiUserPlus className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Create Account
              </button>
            </Link>

            <Link to="/view-products" className="w-full sm:w-auto">
              <button
                type="button"
                className="w-full px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-semibold rounded-lg 
                         text-white bg-blue-900 hover:bg-blue-700 transition-colors duration-200
                         flex items-center justify-center"
              >
                <AiOutlineShoppingCart className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                View Products
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FarmToTable;
