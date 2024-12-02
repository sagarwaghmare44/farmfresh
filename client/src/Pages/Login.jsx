import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import bg from '../assets/backgroundImage.jpg';
import '../styles/loader.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Login = ({ setUserType }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedUserType, setSelectedUserType] = useState('user');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');
    
        try {
            const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/users/login`, { 
                email, 
                password,
                userType: selectedUserType
            });

            if (response.data.success) {
                // Store user info in localStorage
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userId', response.data.user._id);
                localStorage.setItem('userType', response.data.user.role);
                
                // Update global user type
                setUserType(response.data.user.role);

                // Redirect based on user type
                switch(response.data.user.role) {
                    case 'admin':
                        toast.success('Welcome Admin!');
                        navigate('/admin');
                        break;
                    case 'farmer':
                        if (!response.data.user.isVerified || response.data.user.status !== 'approved') {
                            toast.error('Your account is pending approval from admin');
                            localStorage.clear();
                            return;
                        }
                        toast.success('Welcome Farmer!');
                        navigate('/farmer-dashboard');
                        break;
                    default:
                        toast.success('Login successful!');
                        navigate('/home');
                }
            } else {
                throw new Error('Login failed');
            }
        } catch (err) {
            console.error('Login Error:', err);
            toast.error(err.response?.data?.message || 'Login failed. Please try again.');
            setError(err.response?.data?.message || 'An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-5rem)] flex justify-center items-center bg-cover bg-center" 
            style={{ backgroundImage: `url(${bg})` }}
        >
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Login</h2>
                {error && (
                    <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-lg font-semibold mb-2">
                            User Type
                        </label>
                        <select
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={selectedUserType}
                            onChange={(e) => setSelectedUserType(e.target.value)}
                            required
                        >
                            <option value="user">User</option>
                            <option value="farmer">Farmer</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="exampleInputEmail1" className="block text-lg font-semibold mb-2">
                            Email Id
                        </label>
                        <input 
                            type="email" 
                            placeholder="Enter Email"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            id="exampleInputEmail1" 
                            onChange={(event) => setEmail(event.target.value)}
                            required
                            aria-label="Email"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="exampleInputPassword1" className="block text-lg font-semibold mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter Password"
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
                                id="exampleInputPassword1" 
                                onChange={(event) => setPassword(event.target.value)}
                                required
                                aria-label="Password"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors flex justify-center items-center"
                        disabled={loading}
                    >
                        {loading ? <span className="loader"></span> : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}

Login.propTypes = {
    setUserType: PropTypes.func.isRequired
};

export default Login;