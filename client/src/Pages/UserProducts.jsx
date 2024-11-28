import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';

const UserProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [addingToCart, setAddingToCart] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetchApprovedProducts();
    }, []);

    const fetchApprovedProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/products/approved');
            
            if (response.data.success) {
                setProducts(response.data.products);
            } else {
                setError('Failed to fetch products');
                toast.error('Failed to fetch products');
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Error fetching products');
            toast.error('Error fetching products');
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productId) => {
        try {
            setAddingToCart(prev => ({ ...prev, [productId]: true }));
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please login first');
                navigate('/login');
                return;
            }

            console.log('Making request to add to cart:', {
                url: 'http://localhost:8000/api/cart/add',
                productId,
                token
            });

            const response = await axios.post(
                'http://localhost:8000/api/cart/add',
                { productId },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Cart response:', response.data); // Debug log

            if (response.data.success) {
                toast.success('Product added to cart successfully');
            } else {
                toast.error(response.data.message || 'Failed to add to cart');
            }
        } catch (error) {
            console.error('Error adding to cart:', error.response || error);
            if (error.response?.status === 401) {
                toast.error('Please login first');
                navigate('/login');
            } else if (error.response?.status === 404) {
                toast.error('Cart service not available');
            } else {
                toast.error(error.response?.data?.message || 'Error adding to cart');
            }
        } finally {
            setAddingToCart(prev => ({ ...prev, [productId]: false }));
        }
    };

    const filteredProducts = selectedCategory === 'all' 
        ? products 
        : products.filter(product => product.category === selectedCategory);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 mt-10">
                {error}
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 mt-20">
            <h1 className="text-3xl font-bold mb-6">Available Products</h1>
            
            {/* Category Filter */}
            <div className="mb-8">
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="block w-full md:w-48 p-2 border border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500"
                >
                    <option value="all">All Categories</option>
                    <option value="vegetables">Vegetables</option>
                    <option value="fruits">Fruits</option>
                    <option value="dairy">Dairy</option>
                    <option value="grains">Grains</option>
                </select>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                    <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                            <div className="mt-2">
                                <span className="text-green-600 font-bold">₹{product.ourPrice}</span>
                                <span className="text-gray-500 line-through ml-2">₹{product.marketPrice}</span>
                            </div>
                            <div className="mt-2 text-sm text-gray-600">
                                <p>Category: {product.category}</p>
                                <p>Stock: {product.stock} {product.unit}</p>
                                <p>Farmer: {product.farmer?.name || 'Unknown'}</p>
                            </div>
                            <button
                                onClick={() => addToCart(product._id)}
                                disabled={addingToCart[product._id]}
                                className={`mt-4 w-full ${
                                    addingToCart[product._id] 
                                        ? 'bg-gray-400' 
                                        : 'bg-green-500 hover:bg-green-600'
                                } text-white py-2 px-4 rounded-md transition-colors duration-300 flex items-center justify-center`}
                            >
                                <FaShoppingCart className="mr-2" />
                                {addingToCart[product._id] ? 'Adding...' : 'Add to Cart'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="text-center text-gray-500 mt-10">
                    No products found in this category.
                </div>
            )}
        </div>
    );
};

export default UserProducts; 