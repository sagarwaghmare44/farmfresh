
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaFileUpload } from 'react-icons/fa';
import PropTypes from 'prop-types';

const UserTypeSelector = ({ userType, onUserTypeChange }) => (
    <div className="mb-6">
        <label className="block text-lg font-semibold mb-3 text-gray-700">Register as:</label>
        <div className="flex justify-center gap-4">
            {['user', 'farmer'].map((type) => (
                <button
                    key={type}
                    type="button"
                    className={`
                        flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-300
                        ${userType === type 
                            ? 'bg-green-500 text-white shadow-lg transform scale-105' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                    `}
                    onClick={() => onUserTypeChange(type)}
                >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
            ))}
        </div>
    </div>
);

UserTypeSelector.propTypes = {
    userType: PropTypes.oneOf(['user', 'farmer']).isRequired,
    onUserTypeChange: PropTypes.func.isRequired
};

const FormInput = ({ label, type, name, placeholder, icon: Icon, onChange, required = true }) => (
    <div className="mb-4">
        <label htmlFor={name} className="block text-gray-700 font-medium mb-2">
            {label}
        </label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon className="h-5 w-5 text-gray-400" />
            </div>
            <input
                type={type}
                name={name}
                id={name}
                placeholder={placeholder}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                onChange={onChange}
                required={required}
            />
        </div>
    </div>
);

FormInput.propTypes = {
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    onChange: PropTypes.func.isRequired,
    required: PropTypes.bool
};

const FarmerRegister = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        address: '',
        phone: '',
        document: null
    });
    const [userType, setUserType] = useState('farmer');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const validateForm = () => {
        if (!formData.name || !formData.email || !formData.password || !formData.phone || !formData.document) {
            setError('Please fill in all required fields and upload a document');
            return false;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }

        // Phone validation
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(formData.phone)) {
            setError('Please enter a valid 10-digit phone number');
            return false;
        }

        // Password validation
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }

        return true;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setError(''); // Clear error when user types
    };

    const handleDocumentChange = (e) => {
        setFormData({ ...formData, document: e.target.files[0] });
        setError('');
    };

    const handleUserTypeChange = (type) => {
        setUserType(type);
        if (type === 'user') {
            navigate('/signup');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        if (!validateForm()) return;

        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
            formDataToSend.append(key, formData[key]);
        });

        try {
            const response = await axios.post(
                'http://localhost:8000/api/users/farmer-register', 
                formDataToSend,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    timeout: 10000
                }
            );

            if (response.status === 201) {
                alert("Registered successfully! Please Login to proceed.");
                navigate('/login');
            }
        } catch (err) {
            console.error("Error registering farmer:", err);
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="px-8 py-6">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                        Farmer Registration
                    </h2>
                    
                    <UserTypeSelector userType={userType} onUserTypeChange={handleUserTypeChange} />
                    
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                            <p className="font-medium">Error</p>
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <FormInput
                            label="Full Name"
                            type="text"
                            name="name"
                            placeholder="John Doe"
                            icon={FaUser}
                            onChange={handleInputChange}
                        />
                        
                        <FormInput
                            label="Email"
                            type="email"
                            name="email"
                            placeholder="john@example.com"
                            icon={FaEnvelope}
                            onChange={handleInputChange}
                        />

                        <div className="relative">
                            <FormInput
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="••••••••"
                                icon={FaLock}
                                onChange={handleInputChange}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-10"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>

                        <FormInput
                            label="Phone"
                            type="tel"
                            name="phone"
                            placeholder="1234567890"
                            icon={FaPhone}
                            onChange={handleInputChange}
                        />

                        <FormInput
                            label="Address"
                            type="text"
                            name="address"
                            placeholder="Your address"
                            icon={FaMapMarkerAlt}
                            onChange={handleInputChange}
                        />

                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">
                                Upload Document
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaFileUpload className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="file"
                                    name="document"
                                    onChange={handleDocumentChange}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            Register
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">Already have an account?</p>
                        <Link 
                            to='/login' 
                            className="mt-2 inline-block text-green-600 hover:text-green-700 font-medium"
                        >
                            Login here
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FarmerRegister;
