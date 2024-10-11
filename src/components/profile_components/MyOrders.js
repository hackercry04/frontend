import React, { useState, useEffect } from 'react';
import axiosInstance from '../UserAxios';
import SERVERURL from '../../Serverurl';
import { toast, ToastContainer } from 'react-toastify';
import InvoiceComponent from './InvoiceComponent';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
const getStatusColor = (status) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'Shipped': return 'bg-blue-100 text-blue-800';
    case 'Delivered': return 'bg-green-100 text-green-800';
    case 'Cancelled': return 'bg-red-100 text-red-800';
    case 'Return requested': return 'bg-red-400 text-';
    case 'Cancel requested': return  'bg-red-400 text-grey';
    default: return 'bg-gray-100 text-gray-800';
  }
};

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);
  const [statusFilter, setStatusFilter] = useState('all');
  const [c, setChange] = useState(true);

  useEffect(() => {
    axiosInstance.get(`http://${SERVERURL}/user/orders/`)
      .then(res => {
        setOrders(res.data.orders);
        setFilteredOrders(res.data.orders);
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
      });
  }, [c]);

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === statusFilter));
    }
    setCurrentPage(1); // Reset to first page on filter change
  }, [statusFilter, orders]);

  const handleCancel = (orderId) => {
    confirmAlert({
      title: 'Cancel Order',
      message: 'Please provide a reason for cancelling this order:',
      childrenElement: () => <textarea id="cancelReason" rows="3" className="w-full p-2 border rounded"/>,
      buttons: [
        {
          label: 'Confirm',
          onClick: () => {
            const reason = document.getElementById('cancelReason').value;
            axiosInstance.post(`http://${SERVERURL}/user/remove/order/`, { id: orderId, reason: reason }).then(() => {
              toast.success('Item cancelled successfully');
              setChange(!c);
            }).catch(error => {
              console.error('Error cancelling order:', error);
              toast.error('Failed to cancel order');
            });
          }
        },
        {
          label: 'Cancel',
          onClick: () => {}
        }
      ]
    });
  };

  const handleReturn = (orderId) => {
    confirmAlert({
      title: 'Return Order',
      message: 'Please provide a reason for returning this order:',
      childrenElement: () => <textarea id="returnReason" rows="3" className="w-full p-2 border rounded"/>,
      buttons: [
        {
          label: 'Confirm',
          onClick: () => {
            const reason = document.getElementById('returnReason').value;
            axiosInstance.post(`http://${SERVERURL}/user/return/order/`, { id: orderId, reason: reason }).then(() => {
              toast.success('Item returned successfully');
              setChange(!c);
            }).catch(error => {
              console.error('Error returning order:', error);
              toast.error('Failed to return order');
            });
          }
        },
        {
          label: 'Cancel',
          onClick: () => {}
        }
      ]
    });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      
      {/* Filter */}
      <div className="mb-6">
        <label htmlFor="statusFilter" className="mr-2 font-semibold">Filter by status:</label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-left">Image</th>
              <th className="py-3 px-4 text-left">Order ID</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Total</th>
              <th className="py-3 px-4 text-left">Items</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Invoice</th>
              <th className="py-3 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => {
              // Convert ISO timestamp to Date object
              const createdAtDate = new Date(order.created_at);
              // Format the date to just the date part
              const formattedDate = createdAtDate.toLocaleDateString(); // e.g., '9/12/2024'

              return (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <img
                      src={`http://${SERVERURL}/media/${order.img}/`}
                      alt={`Order ${order.id}`}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  </td>
                  <td className="py-4 px-4 font-medium">#{order.id}</td>
                  <td className="py-4 px-4">{formattedDate}</td>
                  <td className="py-4 px-4">${(order.price * order.quantity / 250).toFixed(2)}</td>
                  <td className="py-4 px-4"><h1>{order.product_id__name}</h1>({order.variant_id__name ? order.variant_id__name : 'standard'})</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  
                  <td className='py-4 px-4'>
                    {order.status=="Delivered"?
                      <InvoiceComponent order={order}/> :
                      "  "
                    }
                  </td>
                  <td className="py-4 px-4">
                    {(order.status === 'Delivered'||order.status === 'Return requested')?(
                      <button
                        onClick={() => handleReturn(order.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded text-sm transition duration-300 ease-in-out transform hover:scale-105"
                        disabled={order.status === 'Return requested'}
                      >
                        Return
                      </button>
                    ) : (
                      <button
                        onClick={() => handleCancel(order.id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded text-sm transition duration-300 ease-in-out transform hover:scale-105"
                        disabled={order.status === 'Cancelled' || order.status === 'Cancel Approved'||order.status === 'Return Approved'}
                      >
                        Cancel
                      </button>                  
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center">
        <nav aria-label="Page navigation">
          <ul className="flex">
            {Array.from({ length: totalPages }, (_, index) => (
              <li key={index} className="mx-1">
                <button
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-4 py-2 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
                >
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default MyOrders;