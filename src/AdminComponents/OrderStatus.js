import React, { useState, useEffect } from 'react';
import axiosInstance from './AdminAxios';
import SERVERURL from '../Serverurl';
import { toast, ToastContainer } from 'react-toastify';

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

function OrderStatus() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [change, setChange] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 7;

  // Filter states
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [quantityFilter, setQuantityFilter] = useState('');

  useEffect(() => {
    axiosInstance.get(`http://${SERVERURL}/admin/orders/`)
      .then(res => {
        setOrders(res.data.orders);
        setFilteredOrders(res.data.orders); // Set initial filtered orders
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
      });
  }, [change]);

  useEffect(() => {
    filterOrders();
  }, [statusFilter, dateFilter, priceFilter, quantityFilter]);

  const filterOrders = () => {
    let filtered = [...orders];
    
    if (statusFilter) {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    
    setFilteredOrders(filtered);
    setCurrentPage(1); // Reset to first page after filtering
  };

  const handleEdit = (orderId, currentStatus) => {
    setEditingOrderId(orderId);
    setSelectedStatus(currentStatus);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleSubmitStatus = (orderId) => {
    axiosInstance.post(`http://${SERVERURL}/admin/orders/${orderId}/status/`, {
      status: selectedStatus,
    })
    .then(response => {
      toast.success('Status updated successfully!');
      setChange(!change);
      setEditingOrderId(null);
    })
    .catch(error => {
      toast.error('Failed to update status');
      console.error('Error updating status:', error);
    });
  };

  const handleCancelEdit = () => {
    setEditingOrderId(null);
  };

  // Get the current orders to display based on pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Handle page changes
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6">All Orders</h1>
      
      {/* Filters */}
      <div className="mb-1">
        <label className="block mb-1"/>Status:<select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border rounded px-2 py-1 mb-4">
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Cancel requested">pending cancellation</option>
          <option value="Return request">pending return</option>


        </select>
    

      </div>

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
              <th className="py-3 px-4 text-left">Method</th>
              <th className="py-3 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.slice().reverse().map((order) => {
              const createdAtDate = new Date(order.created_at);
              const formattedDate = createdAtDate.toLocaleDateString();

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
                  <td className="py-4 px-4">${(order.price * (order.quantity) / 250).toFixed(2)}</td>
                  <td className="py-4 px-4"><h1>{order.product_id__name}</h1>({order.variant_id__name ? order.variant_id__name : 'standard'})</td>

                  
                  <td className="py-4 px-4">
                    {editingOrderId === order.id ? (
                      <select value={selectedStatus} onChange={handleStatusChange} className="border rounded px-2 py-1">
                        <option value="pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-4">{order.paymenttype}</td>


                  <td className="py-4 px-4" style={{ minWidth: '150px' }}>
                    {editingOrderId === order.id ? (
                      <>
                        <button
                          onClick={() => handleSubmitStatus(order.id)}
                          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded text-sm transition duration-300 ease-in-out transform hover:scale-105 mr-2"
                          style={{ minWidth: '60px' }}
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded text-sm transition duration-300 ease-in-out transform hover:scale-105"
                          style={{ minWidth: '60px' }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(order.id, order.status)}
                          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded text-sm transition duration-300 ease-in-out transform hover:scale-105"
                          style={{ minWidth: '60px' }}
                        >
                          Edit
                        </button>
                        <button
                        onClick={() => window.location=`/admin/view/order/${order.id}/`}
                          className="mx-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded text-sm transition duration-300 ease-in-out transform hover:scale-105"
                          style={{ minWidth: '60px' }}
                        >
                          View
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="mt-4 flex justify-center items-center">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 mx-1 rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-500 hover:bg-gray-700 text-white'}`}
          >
            Previous
          </button>

          {[...Array(totalPages).keys()].map((num) => (
            <button
              key={num}
              onClick={() => handlePageClick(num + 1)}
              className={`px-4 py-2 mx-1 rounded ${currentPage === num + 1 ? 'bg-blue-500 text-white' : 'bg-gray-500 hover:bg-gray-700 text-white'}`}
            >
              {num + 1}
            </button>
          ))}

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 mx-1 rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-500 hover:bg-gray-700 text-white'}`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderStatus;
