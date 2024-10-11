import React, { useState } from 'react';

const initialOrders = [
  { id: '1234', date: '2023-05-01', total: 125.99, status: 'Delivered', items: 3, image: 'https://picsum.photos/seed/1234/100/100' },
  { id: '5678', date: '2023-05-15', total: 79.99, status: 'Shipped', items: 2, image: 'https://picsum.photos/seed/5678/100/100' },
  { id: '9012', date: '2023-05-30', total: 199.99, status: 'Processing', items: 1, image: 'https://picsum.photos/seed/9012/100/100' },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'Processing': return 'bg-yellow-100 text-yellow-800';
    case 'Shipped': return 'bg-blue-100 text-blue-800';
    case 'Delivered': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

function MyOrders() {
  const [orders, setOrders] = useState(initialOrders);

  const handleCancel = (orderId) => {
    setOrders(orders.filter(order => order.id !== orderId));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
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
              <th className="py-3 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="py-4 px-4">
                  <img 
                    src={order.image} 
                    alt={`Order ${order.id}`} 
                    className="w-16 h-16 object-cover rounded-md"
                  />
                </td>
                <td className="py-4 px-4 font-medium">{order.id}</td>
                <td className="py-4 px-4">{order.date}</td>
                <td className="py-4 px-4">${order.total.toFixed(2)}</td>
                <td className="py-4 px-4">{order.items}</td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-4 px-4">
                  {order.status === 'Processing' && (
                    <button 
                      onClick={() => handleCancel(order.id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded text-sm transition duration-300 ease-in-out transform hover:scale-105"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MyOrders;