import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './Pages/Home';
import About from './Pages/About';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import FarmerRegister from './Pages/FarmerRegister';
import Cart from './Pages/Cart';
import PaymentPage from './Pages/PaymentPage';
import PaymentUPI from './Pages/PaymentUPI';
import UserDashboard from './Pages/UserDashboard';
import AddProducts from './Pages/AddProducts';
import Admin from './Pages/Admin';
import ManageUsers from './Pages/ManageUsers';
import ManageFarmers from './Pages/ManageFarmers';
import ContactUs from './Pages/ContactUs';
import AdminRegister from './Pages/AdminRegister';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ManageProducts from './Pages/ManageProducts';
import UserProducts from './Pages/UserProducts';


function App() {
    const [userType, setUserType] = useState('none');

    return (
        <Router>
            <div className="flex flex-col min-h-screen">
                <Navbar userType={userType} />
                <main className="flex-grow pt-14">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/login" element={<Login setUserType={setUserType} />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/user-dashboard" element={<UserDashboard />} />
                        <Route path="/payment" element={<PaymentPage />} />
                        <Route path="/paymentupi" element={<PaymentUPI />} />
                        <Route path="/farmer-register" element={<FarmerRegister />} />
                        <Route path="/add-products" element={<AddProducts />} />
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/manage-users" element={<ManageUsers />} />
                        <Route path="/manage-farmers" element={<ManageFarmers />} />
                        <Route path="/contact" element={<ContactUs />} />
                        <Route path="/admin-register" element={<AdminRegister />} />
                        <Route path="/manage-products" element={<ManageProducts />} />
                        <Route path="/user-products" element={<UserProducts />} />
                    </Routes>
                </main>
                <Footer />
                <ToastContainer position="top-right" autoClose={3000} />
            </div>
        </Router>
    );
}

export default App;
