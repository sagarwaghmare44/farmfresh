import PropTypes from 'prop-types';

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="border border-gray-300 p-3 md:p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      <img src={product.image} alt={product.name} className="w-full h-32 md:h-40 object-cover rounded-lg" />
      <h2 className="text-base md:text-lg font-semibold mt-2">{product.name}</h2>
      <p className="text-sm md:text-base text-gray-600">Category: {product.category}</p>
      <p className="text-sm md:text-base text-gray-600">Farmer: {product.farmerName}</p>
      <div className="flex justify-between mt-2">
        <span className="text-sm md:text-base text-green-600">₹{product.ourPrice}</span>
        <span className="text-sm md:text-base text-red-500 line-through">₹{product.marketPrice}</span>
      </div>
      <div className="flex items-center mt-2">
        <span className="text-yellow-500">{'★'.repeat(product.rating)}</span>
        <span className="text-xs md:text-sm text-gray-600 ml-2">({product.reviews} reviews)</span>
      </div>
      
      <button
        onClick={() => onAddToCart(product)}
        className="mt-3 w-full bg-blue-600 text-white py-1.5 md:py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm md:text-base"
      >
        Add to Cart
      </button>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string,
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    farmerName: PropTypes.string.isRequired,
    ourPrice: PropTypes.number.isRequired,
    marketPrice: PropTypes.number.isRequired,
    rating: PropTypes.number.isRequired,
    reviews: PropTypes.number.isRequired,
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

export default ProductCard;
