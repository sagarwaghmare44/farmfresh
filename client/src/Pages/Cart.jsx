import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus, FaShoppingBag } from 'react-icons/fa';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please login first');
                navigate('/login');
                return;
            }

            const response = await axios.get('http://localhost:8000/api/cart', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setCartItems(response.data.cart.items || []);
                setTotalAmount(response.data.cart.totalAmount || 0);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
            toast.error('Failed to fetch cart items');
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (productId, newQuantity) => {
        if (updating) return;
        if (newQuantity < 1) return;

        try {
            setUpdating(true);
            const token = localStorage.getItem('token');
            
            const response = await axios.put(
                `http://localhost:8000/api/cart/update/${productId}`,
                { quantity: newQuantity },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                fetchCartItems();
                toast.success('Cart updated');
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
            toast.error('Failed to update quantity');
        } finally {
            setUpdating(false);
        }
    };

    const removeFromCart = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            
            const response = await axios.delete(
                `http://localhost:8000/api/cart/remove/${productId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                fetchCartItems();
                toast.success('Item removed from cart');
            }
        } catch (error) {
            console.error('Error removing item:', error);
            toast.error('Failed to remove item');
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            return total + (item.product.ourPrice * item.quantity);
        }, 0);
    };

    const handleCheckout = () => {
        navigate('/payment');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 mt-20">
            <h1 className="text-3xl font-bold mb-8 flex items-center">
                <FaShoppingBag className="mr-3" />
                Shopping Cart
            </h1>

            {cartItems.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-gray-500 text-xl mb-4">Your cart is empty</div>
                    <button
                        onClick={() => navigate('/user-products')}
                        className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                        Continue Shopping
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            {cartItems.map((item) => (
                                <div key={item.product._id} className="p-4 border-b last:border-b-0 hover:bg-gray-50">
                                    <div className="flex items-center space-x-4">
                                        <img
                                            src={item.product.imageUrl}
                                            alt={item.product.name}
                                            className="w-20 h-20 object-cover rounded-lg"
                                        />
                                        <div className="flex-grow">
                                            <h3 className="text-lg font-semibold">{item.product.name}</h3>
                                            <p className="text-gray-600">{item.product.category}</p>
                                            <div className="mt-1">
                                                <span className="text-green-600 font-bold">₹{item.product.ourPrice}</span>
                                                <span className="text-gray-500 line-through ml-2">₹{item.product.marketPrice}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                                                className="p-1 rounded-full hover:bg-gray-200"
                                                disabled={updating}
                                            >
                                                <FaMinus />
                                            </button>
                                            <span className="w-8 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                                className="p-1 rounded-full hover:bg-gray-200"
                                                disabled={updating}
                                            >
                                                <FaPlus />
                                            </button>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold">₹{item.product.ourPrice * item.quantity}</div>
                                            <button
                                                onClick={() => removeFromCart(item.product._id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span>Subtotal ({cartItems.length} items)</span>
                                    <span>₹{totalAmount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                                <div className="border-t pt-3">
                                    <div className="flex justify-between font-bold">
                                        <span>Total</span>
                                        <span>₹{totalAmount}</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={handleCheckout}
                                className="w-full mt-6 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors"
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart; 