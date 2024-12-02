import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [farmers, setFarmers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [documentLoading, setDocumentLoading] = useState(false);
    const [documentError, setDocumentError] = useState(null);
    const navigate = useNavigate();
//    Admin fixed
    useEffect(() => {
        fetchData();
        fetchProducts();
    }, []);

    const fetchData = async () => {
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
                const { users: regularUsers, farmers: farmerUsers } = response.data.data;
                setUsers(regularUsers || []);
                setFarmers(farmerUsers || []);
            } else {
                toast.error('Failed to fetch users');
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            if (error.response?.status === 401) {
                toast.error('Session expired. Please login again');
                localStorage.clear();
                navigate('/login');
            } else {
                toast.error('Error fetching users');
            }
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please login first');
                navigate('/login');
                return;
            }

            const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/products/pending`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setProducts(response.data.products);
            } else {
                toast.error('Failed to fetch products');
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Error fetching products');
        }
    };

    const handleStatusChange = async (farmerId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please login first');
                navigate('/login');
                return;
            }

            console.log('Updating status:', { farmerId, newStatus }); // Debug log

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

            console.log('Update response:', response.data); // Debug log

            if (response.data.success) {
                // Update the farmers list with the new status
                setFarmers(prevFarmers => 
                    prevFarmers.map(farmer => 
                        farmer._id === farmerId 
                            ? { 
                                ...farmer, 
                                status: newStatus, 
                                isVerified: newStatus === 'approved'
                              }
                            : farmer
                    )
                );
                toast.success(`Farmer status updated to ${newStatus}`);
                
                // Refresh the data to ensure we have the latest state
                await fetchData();
            } else {
                toast.error(response.data.message || 'Failed to update status');
            }
        } catch (error) {
            console.error('Error updating farmer status:', error);
            if (error.response?.status === 401) {
                toast.error('Session expired. Please login again');
                localStorage.clear();
                navigate('/login');
            } else {
                toast.error(error.response?.data?.message || 'Failed to update farmer status');
            }
        }
    };

    const handleProductApproval = async (productId, status) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please login first');
                navigate('/login');
                return;
            }

            const response = await axios.put(
                `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/products/${productId}/status`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                toast.success(`Product ${status}`);
                fetchProducts(); // Refresh the products list
            } else {
                toast.error('Failed to update product status');
            }
        } catch (error) {
            console.error('Error updating product status:', error);
            toast.error('Error updating product status');
        }
    };

    const viewDocument = async (documentUrl) => {
        setDocumentLoading(true);
        setDocumentError(null);
        
        try {
            // Check if it's a PDF
            const isPDF = documentUrl.toLowerCase().includes('.pdf');
            
            setSelectedDocument({
                url: documentUrl,
                type: isPDF ? 'pdf' : 'image'
            });
        } catch (error) {
            console.error('Error loading document:', error);
            setDocumentError('Failed to load document');
        } finally {
            setDocumentLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="p-2 md:p-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Admin Dashboard</h1>
            
            {/* Summary Cards - Made more compact on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-6">
                <div className="bg-blue-100 p-3 md:p-4 rounded-lg shadow-md">
                    <h2 className="text-lg md:text-xl font-semibold">Total Users</h2>
                    <p className="text-2xl md:text-3xl font-bold">{users.length}</p>
                </div>
                <div className="bg-green-100 p-3 md:p-4 rounded-lg shadow-md">
                    <h2 className="text-lg md:text-xl font-semibold">Total Farmers</h2>
                    <p className="text-2xl md:text-3xl font-bold">{farmers.length}</p>
                </div>
                <div className="bg-yellow-100 p-3 md:p-4 rounded-lg shadow-md">
                    <h2 className="text-lg md:text-xl font-semibold">Pending Products</h2>
                    <p className="text-2xl md:text-3xl font-bold">{products.length}</p>
                </div>
            </div>

            {/* Users List - Made scrollable on mobile */}
            <div className="mb-6">
                <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Regular Users</h2>
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <div className="min-w-full inline-block align-middle">
                        <div className="overflow-hidden">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {users.map((user) => (
                                        <tr key={user._id} className="hover:bg-gray-50">
                                            <td className="px-3 md:px-6 py-2 md:py-4 text-sm whitespace-nowrap">{user.name}</td>
                                            <td className="px-3 md:px-6 py-2 md:py-4 text-sm whitespace-nowrap">{user.email}</td>
                                            <td className="px-3 md:px-6 py-2 md:py-4 text-sm whitespace-nowrap">{user.contact || 'N/A'}</td>
                                            <td className="px-3 md:px-6 py-2 md:py-4 text-sm whitespace-nowrap">{user.address || 'N/A'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Farmers List - Made scrollable on mobile */}
            <div>
                <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Farmers</h2>
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <div className="min-w-full inline-block align-middle">
                        <div className="overflow-hidden">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {farmers.map((farmer) => (
                                        <tr key={farmer._id} className="hover:bg-gray-50">
                                            <td className="px-3 md:px-6 py-2 md:py-4 text-sm whitespace-nowrap">{farmer.name}</td>
                                            <td className="px-3 md:px-6 py-2 md:py-4 text-sm whitespace-nowrap">{farmer.email}</td>
                                            <td className="px-3 md:px-6 py-2 md:py-4 text-sm whitespace-nowrap">{farmer.contact || 'N/A'}</td>
                                            <td className="px-3 md:px-6 py-2 md:py-4 text-sm whitespace-nowrap">{farmer.address || 'N/A'}</td>
                                            <td className="px-3 md:px-6 py-2 md:py-4 text-sm whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs rounded-full 
                                                    ${farmer.status === 'approved' ? 'bg-green-100 text-green-800' : 
                                                      farmer.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                                      'bg-red-100 text-red-800'}`}>
                                                    {farmer.status || 'pending'}
                                                </span>
                                            </td>
                                            <td className="px-3 md:px-6 py-2 md:py-4 text-sm whitespace-nowrap">
                                                {farmer.document && (
                                                    <button
                                                        onClick={() => viewDocument(farmer.document)}
                                                        className="text-blue-600 hover:text-blue-900 text-sm"
                                                    >
                                                        View Doc
                                                    </button>
                                                )}
                                            </td>
                                            <td className="px-3 md:px-6 py-2 md:py-4 text-sm whitespace-nowrap">
                                                <select
                                                    value={farmer.status || 'pending'}
                                                    onChange={(e) => handleStatusChange(farmer._id, e.target.value)}
                                                    className="text-sm rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="approved">Approve</option>
                                                    <option value="rejected">Reject</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products for Review - Made scrollable on mobile */}
            <div className="mt-6">
                <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Products for Review</h2>
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <div className="min-w-full inline-block align-middle">
                        <div className="overflow-hidden">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Farmer</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prices</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {products.map((product) => (
                                        <tr key={product._id} className="hover:bg-gray-50">
                                            <td className="px-3 md:px-6 py-2 md:py-4 text-sm whitespace-nowrap">{product.name}</td>
                                            <td className="px-3 md:px-6 py-2 md:py-4 text-sm whitespace-nowrap">{product.farmer?.name || 'N/A'}</td>
                                            <td className="px-3 md:px-6 py-2 md:py-4 text-sm whitespace-nowrap capitalize">{product.category}</td>
                                            <td className="px-3 md:px-6 py-2 md:py-4 text-sm whitespace-nowrap">
                                                <div>
                                                    <span className="text-green-600 font-bold">₹{product.ourPrice}</span>
                                                    <span className="text-gray-500 line-through ml-2">₹{product.marketPrice}</span>
                                                </div>
                                            </td>
                                            <td className="px-3 md:px-6 py-2 md:py-4 text-sm whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs rounded-full 
                                                    ${product.status === 'approved' ? 'bg-green-100 text-green-800' : 
                                                    product.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                                    'bg-red-100 text-red-800'}`}>
                                                    {product.status}
                                                </span>
                                            </td>
                                            <td className="px-3 md:px-6 py-2 md:py-4 text-sm whitespace-nowrap">
                                                {product.imageUrl && (
                                                    <img 
                                                        src={product.imageUrl} 
                                                        alt={product.name}
                                                        className="h-10 w-10 rounded-full object-cover cursor-pointer"
                                                        onClick={() => viewDocument(product.imageUrl)}
                                                    />
                                                )}
                                            </td>
                                            <td className="px-3 md:px-6 py-2 md:py-4 text-sm whitespace-nowrap">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleProductApproval(product._id, 'approved')}
                                                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full hover:bg-green-200"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleProductApproval(product._id, 'rejected')}
                                                        className="px-3 py-1 bg-red-100 text-red-800 rounded-full hover:bg-red-200"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Document Modal - Made more mobile-friendly */}
            {selectedDocument && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 md:p-4 z-50">
                    <div className="bg-white rounded-lg w-full max-w-lg md:max-w-4xl">
                        <div className="p-3 md:p-4 border-b flex justify-between items-center">
                            <h3 className="text-base md:text-lg font-semibold">Farmer Document</h3>
                            <button
                                onClick={() => setSelectedDocument(null)}
                                className="text-gray-500 hover:text-gray-700 text-xl"
                            >
                                ×
                            </button>
                        </div>
                        <div className="p-3 md:p-4">
                            {documentLoading ? (
                                <div className="flex justify-center items-center h-[300px] md:h-[600px]">
                                    <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-t-2 border-b-2 border-green-500"></div>
                                </div>
                            ) : documentError ? (
                                <div className="text-red-500 text-center py-4">
                                    {documentError}
                                </div>
                            ) : selectedDocument.type === 'pdf' ? (
                                <iframe
                                    src={selectedDocument.url}
                                    className="w-full h-[300px] md:h-[600px]"
                                    title="Farmer Document"
                                />
                            ) : (
                                <img
                                    src={selectedDocument.url}
                                    alt="Farmer Document"
                                    className="max-w-full h-auto mx-auto"
                                />
                            )}
                        </div>
                        <div className="p-3 md:p-4 border-t flex justify-between">
                            <a
                                href={selectedDocument.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm md:text-base text-blue-600 hover:text-blue-800"
                            >
                                Open in New Tab
                            </a>
                            <button
                                onClick={() => setSelectedDocument(null)}
                                className="px-3 py-1 md:px-4 md:py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm md:text-base"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;