import React, { useEffect, useState } from 'react';
import axiosInstance from '../UserAxios';
import SERVERURL from '../../Serverurl';
import { FaWallet, FaArrowUp, FaArrowDown } from 'react-icons/fa';

export default function WalletV() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get(`https://${SERVERURL}/user/get/wallet/`).then((res) => {
      setOrders(res.data.wallet);
      setLoading(false);
    });
  }, []);

  const totalAmount = orders.reduce((sum, order) => sum + parseInt(order.amount), 0);

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-green-400 to-green-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <FaWallet className="mr-2" /> Wallet
          </h2>
          <div className="text-3xl font-bold text-white">
            ${totalAmount.toFixed(2)}
          </div>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          <ul className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
            {orders.map((order) => (
              <li key={order.id} className="px-6 py-4 hover:bg-orange-50 transition duration-150 ease-in-out">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {order.amount > 0 ? (
                      <FaArrowUp className="text-green-500 mr-2" />
                    ) : (
                      <FaArrowDown className="text-red-500 mr-2" />
                    )}
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {order.amount > 0 ? order.orderitem_id__product_id__name : 'Payment'}
                    </div>
                  </div>
                  <div className="ml-2 flex-shrink-0">
                    <span className={`px-2 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                      order.amount > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      ${Math.abs(order.amount).toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-xs text-gray-500">
                      Order ID: {order.id}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-xs text-gray-500 sm:mt-0">
                    {order.amount > 0 ? 'Refund' : 'Payment'} on {new Date(order.created_at).toLocaleDateString()}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="px-6 py-4 bg-gray-50">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium text-gray-900">Total Balance</span>
          <span className="text-2xl font-bold text-orange-600">${totalAmount.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}