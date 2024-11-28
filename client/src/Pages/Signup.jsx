import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import bg from '../assets/backgroundImage.jpg';

const SignUp = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [userType, setUserType] = useState('user');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        try {
            const result = await axios.post('http://localhost:8000/api/users/register', { ...formData, userType });
            console.log(result);

            if (result.data === "Already registered") {
                alert("E-mail already registered! Please Login to proceed.");
                navigate('/login');
            } else {
                alert("Registered successfully! Please Login to proceed.");
                navigate('/login');
            }
        } catch (err) {
            console.error("Registration error:", err);
            if (err.response && err.response.status === 500) {
                alert("Internal Server Error. Please try again later.");
            } else {
                alert("An error occurred. Please check your network connection or try again.");
            }
        }
    };

    const handleUserTypeChange = (type) => {
        setUserType(type);
        if (type === 'farmer') {
            navigate('/farmer-register');
        }
    };

    return (
        <div
            className="flex justify-center items-center text-center min-h-screen bg-cover bg-center"
            style={{ backgroundImage: `url(${bg})` }}
        >
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md md:max-w-lg lg:max-w-xl">
                <h2 className="mb-6 text-2xl font-bold">Register</h2>

                <div className="mb-4">
                    <label className="block text-lg font-semibold mb-2">Register as:</label>
                    <div className="flex justify-center">
                        <button
                            type="button"
                            className={`mx-2 py-2 px-4 rounded-lg ${userType === 'user' ? 'bg-green-500 text-white' : 'bg-gray-200 text-black'} hover:bg-green-600 transition-colors`}
                            onClick={() => handleUserTypeChange('user')}
                        >
                            User
                        </button>
                        <button
                            type="button"
                            className={`mx-2 py-2 px-4 rounded-lg ${userType === 'farmer' ? 'bg-green-500 text-white' : 'bg-gray-200 text-black'} hover:bg-green-600 transition-colors`}
                            onClick={() => handleUserTypeChange('farmer')}
                        >
                            Farmer
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4 text-left">
                        <label htmlFor="name" className="block text-lg font-semibold mb-2">Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter Name"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:bg-green-200"
                            id="name"
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="mb-4 text-left">
                        <label htmlFor="email" className="block text-lg font-semibold mb-2">Email Id</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter Email"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:bg-green-200"
                            id="email"
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="mb-4 text-left">
                        <label htmlFor="password" className="block text-lg font-semibold mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter Password"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            id="password"
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Register
                    </button>
                </form>

                <p className="my-4">Already have an account?</p>
                <Link to='/login' className="w-full inline-block bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors">
                    Login
                </Link>
            </div>
        </div>
    );
};

export default SignUp;
