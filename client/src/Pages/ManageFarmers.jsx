import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ManageFarmers = () => {
    const [farmers, setFarmers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchFarmers();
    }, []);

    const fetchFarmers = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please login first');
                navigate('/login');
                return;
            }

            const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/users/all`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setFarmers(response.data.data.farmers); 
            } else {
                toast.error('Failed to fetch farmers');
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching farmers:', error);
            if (error.response?.status === 401) {
                toast.error('Session expired. Please login again');
                localStorage.clear();
                navigate('/login');
            } else {
                toast.error('Error fetching farmers');
            }
            setLoading(false);
        }
    };

    const handleStatusChange = async (farmerId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/users/farmer-status/${farmerId}`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                toast.success(`Farmer status updated to ${newStatus}`);
                fetchFarmers(); // Refresh the list
            }
        } catch (error) {
            console.error('Error updating farmer status:', error);
            toast.error('Failed to update farmer status');
        }
    };

    const handleDeleteFarmer = async (farmerId) => {
        if (window.confirm('Are you sure you want to delete this farmer?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/users/${farmerId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Farmer deleted successfully');
                fetchFarmers(); // Refresh the list
            } catch (error) {
                console.error('Error deleting farmer:', error);
                toast.error('Failed to delete farmer');
            }
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Manage Farmers</h1>
            
            <div className="bg-green-100 p-4 rounded-lg mb-6">
                <h2 className="text-xl font-semibold">Total Farmers</h2>
                <p className="text-3xl font-bold">{farmers.length}</p>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow-md">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Email</th>
                            <th className="px-4 py-2">Contact</th>
                            <th className="px-4 py-2">Address</th>
                            <th className="px-4 py-2">Status</th>
                            <th className="px-4 py-2">Document</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {farmers.map((farmer) => (
                            <tr key={farmer._id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-2">{farmer.name}</td>
                                <td className="px-4 py-2">{farmer.email}</td>
                                <td className="px-4 py-2">{farmer.contact || farmer.phone || 'N/A'}</td>
                                <td className="px-4 py-2">{farmer.address || 'N/A'}</td>
                                <td className="px-4 py-2">
                                    <span className={`px-2 py-1 rounded-full text-xs
                                        ${farmer.status === 'approved' ? 'bg-green-100 text-green-800' : 
                                          farmer.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                          'bg-red-100 text-red-800'}`}
                                    >
                                        {farmer.status || 'pending'}
                                    </span>
                                </td>
                                <td className="px-4 py-2">
                                    {farmer.document || farmer.documentUrl ? (
                                        <a
                                            href={farmer.document || farmer.documentUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            View
                                        </a>
                                    ) : 'N/A'}
                                </td>
                                <td className="px-4 py-2 space-x-2">
                                    <select
                                        value={farmer.status || 'pending'}
                                        onChange={(e) => handleStatusChange(farmer._id, e.target.value)}
                                        className="mr-2 rounded border-gray-300"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approve</option>
                                        <option value="rejected">Reject</option>
                                    </select>
                                    <button
                                        onClick={() => handleDeleteFarmer(farmer._id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageFarmers; 