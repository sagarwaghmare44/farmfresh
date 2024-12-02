import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalAmount } = location.state || { totalAmount: 0 };

  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

  const handleMakePaymentClick = () => {
    setShowPaymentOptions(true);
  };

  const showOrderPlacedNotification = () => {
    toast.success('Order Placed Successfully!', {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  const handleUPIPayment = () => {
    toast.info('Redirecting to UPI Payment...', {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

    setTimeout(() => {
      navigate('/paymentupi', { state: { totalAmount } });
    }, 2000);
  };

  return (
    <div className="p-6 flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-semibold mb-4">Payment Page</h2>
        <p className="text-lg mb-4">Total Amount: ₹{totalAmount}</p>

        {!showPaymentOptions ? (
          <button
            onClick={handleMakePaymentClick}
            className="mt-4 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            Make Payment
          </button>
        ) : (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Choose Payment Method</h3>
            <div className="flex flex-col items-center gap-4">
              <button
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                onClick={() => {
                  showOrderPlacedNotification();
                }}
              >
                Cash on Delivery
              </button>
              <button
                className="w-full bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors duration-200"
                onClick={handleUPIPayment}
              >
                UPI
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Toast Container for notifications */}
      <ToastContainer />
    </div>
  );
};

export default Payment;
