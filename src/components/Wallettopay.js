import React, { useEffect, useState, useCallback } from 'react';
import axiosInstance from './UserAxios';
import SERVERURL from '../Serverurl';
import { toast,ToastContainer } from 'react-toastify';

export default function WalletToPay({ addrid, datatosend, couponCode, amount }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    axiosInstance.get(`http://${SERVERURL}/user/get/wallet/`)
      .then((res) => {
        setBalance(res.data.total);
      })
      .catch((error) => {
        console.error('Failed to fetch wallet balance:', error);
        setMessage({ type: 'error', text: 'Failed to fetch wallet balance' });
      });
  }, []);

  const handlePayment = useCallback(() => {
    if (addrid===0 || addrid==''){

      toast.error('please select an address')
      return 
    }
    setIsLoading(true);
    axiosInstance.post(`http://${SERVERURL}/user/placeorder/`, {
      address_id: addrid,
      products: datatosend,
      coupon: couponCode,
      paymenttype: 'wallet'
    }).then((res) => {
      setIsLoading(false);
      setIsDialogOpen(false);
      setMessage({ type: 'success', text: res.data.message });
      window.location = '/user/order/success';
    }).catch((e) => {
      setIsLoading(false);
      setIsDialogOpen(false);
      setMessage({ type: 'error', text: e.response?.data?.message || "An error occurred" });
    });
  }, [addrid, datatosend, couponCode]);

  const isInsufficientBalance = amount > balance;

  return (
    <div className="relative">
      <ToastContainer/>
      <div className="bg-white p-6 rounded-sm shadow-md">
        <button
          onClick={() => setIsDialogOpen(true)}
          className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out ${isInsufficientBalance ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isInsufficientBalance}
        >
          Pay with Wallet
        </button>
        <p className="mt-2 text-sm text-gray-600">Balance: ${balance !== null ? balance.toFixed(2) : '0.00'}</p>
        {isInsufficientBalance && (
          <p className="mt-2 text-sm font-bold text-red-500">Insufficient Balance</p>
        )}
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Confirm Payment</h2>
            <p className="mb-4">Are you sure you want to pay ${amount.toFixed(2)} with your wallet?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsDialogOpen(false)}
                disabled={isLoading}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50 transition duration-300 ease-in-out"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition duration-300 ease-in-out"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : "Confirm Payment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {message && (
        <div className={`mt-4 p-2 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`} role="alert">
          {message.text}
        </div>
      )}
    </div>
  );
}