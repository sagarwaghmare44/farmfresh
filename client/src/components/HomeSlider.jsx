import Slider from "react-slick";
import { useNavigate } from "react-router-dom";

import Veg1 from "../assets/Veg1.jpg";
// import Veg2 from "../assets/Veg2.jpg";
import Veg3 from "../assets/Veg3.jpg";
// import Veg4 from "../assets/Veg4.jpg";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HomeSlider = () => {
  const navigate = useNavigate();
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    cssEase: 'linear'
  };

  const handleDiscoverClick = () => {
    navigate("/products");
  };

  return (
    <div className="relative max-w-full overflow-hidden">
      <Slider {...settings}>
        {[Veg1, Veg3].map((img, index) => (
          <div key={index} className="relative">
            <div className="absolute inset-0 bg-black/40 z-10" />
            <img
              src={img}
              alt={`Slide ${index + 1}`}
              className="w-screen h-[85vh] object-cover brightness-50"
            />
          </div>
        ))}
      </Slider>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center z-20 w-full max-w-6xl px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Bridging Farms to Your Plate
          <span className="block text-green-400">with Freshness and Care</span>
        </h1>
        <p className="text-lg md:text-xl mb-8 text-gray-200">
          Experience the finest selection of fresh, organic produce delivered directly to you
        </p>
        <button
          onClick={handleDiscoverClick}
          className="bg-green-500 text-white py-4 px-8 rounded-full text-lg font-semibold
                   shadow-lg hover:bg-green-600 transition-all duration-300 
                   hover:scale-105 hover:shadow-xl"
        >
          Discover the Taste of Pure
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="flex flex-col items-center transform hover:scale-105 transition-transform duration-300">
            <div className="bg-green-500/20 p-4 rounded-full mb-3">
              <i className="fas fa-tractor fa-2x text-green-400"></i>
            </div>
            <span className="font-bold text-lg">Choose your farmer</span>
            <span className="text-sm text-gray-300 mt-1">Direct from local farms</span>
          </div>

          <div className="flex flex-col items-center transform hover:scale-105 transition-transform duration-300">
            <div className="bg-green-500/20 p-4 rounded-full mb-3">
              <i className="fas fa-seedling fa-2x text-green-400"></i>
            </div>
            <span className="font-bold text-lg">Organically grown</span>
            <span className="text-sm text-gray-300 mt-1">100% organic certified</span>
          </div>

          <div className="flex flex-col items-center transform hover:scale-105 transition-transform duration-300">
            <div className="bg-green-500/20 p-4 rounded-full mb-3">
              <i className="fas fa-truck fa-2x text-green-400"></i>
            </div>
            <span className="font-bold text-lg">Quick Delivery</span>
            <span className="text-sm text-gray-300 mt-1">Right to your doorstep</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSlider;
