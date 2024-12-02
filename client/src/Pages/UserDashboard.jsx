import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUser, FaShoppingBag, FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';

const UserDashboard = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [userInfo, setUserInfo] = useState({
        name: '',
        email: '',
        contact: '',
        address: '',
        avatar: null
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userId = localStorage.getItem('userId');
                const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/users/${userId}`);
                setUserInfo(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('Failed to load user information');
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const userId = localStorage.getItem('userId');
            await axios.put(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/users/${userId}`, userInfo);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                toast.error('File size should be less than 10MB');
                return;
            }

            if (!file.type.startsWith('image/')) {
                toast.error('Only image files are allowed');
                return;
            }

            const formData = new FormData();
            formData.append('avatar', file);

            try {
                const userId = localStorage.getItem('userId');
                const response = await axios.post(
                    `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/users/${userId}/avatar`,
                    formData,
                    {
                        headers: { 'Content-Type': 'multipart/form-data' },
                        onUploadProgress: (progressEvent) => {
                            const progress = Math.round(
                                (progressEvent.loaded * 100) / progressEvent.total
                            );
                            setUploadProgress(progress);
                        }
                    }
                );

                if (response.data.success) {
                    setUserInfo({ ...userInfo, avatar: response.data.avatarUrl });
                    toast.success('Avatar updated successfully');
                }
            } catch (error) {
                console.error('Error uploading avatar:', error);
                toast.error(error.response?.data?.message || 'Failed to upload avatar');
            } finally {
                setUploadProgress(0);
            }
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    const renderProfile = () => (
        <div className="bg-white p-6 rounded-lg shadow-md m-10">
            <div className="flex flex-col items-center mb-6">
                <div className="relative">
                    <img
                        src={userInfo.avatar || 'https://via.placeholder.com/150'}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover"
                    />
                    <label className="absolute bottom-0 right-0 bg-green-500 p-2 rounded-full cursor-pointer">
                        <FaEdit className="text-white" />
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                        />
                    </label>
                    {uploadProgress > 0 && (
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                            <span className="text-white">{uploadProgress}%</span>
                        </div>
                    )}
                </div>
                <h2 className="text-2xl font-bold mt-4">{userInfo.name}</h2>
                <p className="text-gray-600">{userInfo.email}</p>
            </div>

            <form onSubmit={handleUpdateProfile}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            value={userInfo.name}
                            onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Contact</label>
                        <input
                            type="tel"
                            value={userInfo.contact}
                            onChange={(e) => setUserInfo({ ...userInfo, contact: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <textarea
                            value={userInfo.address}
                            onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            rows="3"
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
                >
                    Update Profile
                </button>
            </form>
        </div>
    );

    return (
        <div className="container mx-auto px-4 m-10">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Sidebar */}
                <div className="md:w-1/4">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <div className="space-y-2">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`w-full flex items-center space-x-2 p-2 rounded-md ${
                                    activeTab === 'profile' ? 'bg-green-500 text-white' : 'hover:bg-gray-100'
                                }`}
                            >
                                <FaUser />
                                <span>Profile</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`w-full flex items-center space-x-2 p-2 rounded-md ${
                                    activeTab === 'orders' ? 'bg-green-500 text-white' : 'hover:bg-gray-100'
                                }`}
                            >
                                <FaShoppingBag />
                                <span>My Orders</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="md:w-3/4">
                    {error && (
                        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
                            {error}
                        </div>
                    )}
                    {activeTab === 'profile' && renderProfile()}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
