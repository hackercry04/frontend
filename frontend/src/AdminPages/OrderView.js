import React, { useEffect, useState } from 'react';
import axiosInstance from '../AdminComponents/AdminAxios'
import { useParams } from 'react-router-dom';
import SERVERURL from '../Serverurl';
import { CgProfile } from "react-icons/cg";
import { toast, ToastContainer } from 'react-toastify';
import Userreturncancelmanager from '../AdminComponents/Userreturncancelmanager';
import logo from '../static/img/logo-removebg.png'
import OrderStatus from '../AdminComponents/OrderStatus';
import NavbarComponent from '../AdminComponents/NavbarComponent';
export default function OrderView() {
  const [status, setStatus] = useState('');
  const [order,setOrder]=useState([])
  const orderid=useParams('orderid')

  useEffect(()=>{

 axiosInstance.get(`http://${SERVERURL}/admin/orders/${orderid.orderid}/`).then((res)=>{

  setOrder(res.data.order[0])
  setStatus(res.data.order[0].status)

 })
 
},[])


 const formattedDate =(timestamp)=> new Date(timestamp).toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;
    setStatus(newStatus);
    axiosInstance.post(`http://${SERVERURL}/admin/orders/${orderid.orderid}/status/`,{

      status:newStatus
    }).then(
      (res)=>{

        toast.success('status updated successfully')
      }
    )

  }
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'Return requested': return 'bg-red-100 text';
      case 'Cancel requested': return  'bg-red-400 text-red-500';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
<NavbarComponent/>
    <div className="container mx-auto p-6 space-y-8 my-10 bg-white" >
      
      <ToastContainer/>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Order #{order.id}</h1>
      
          <span class={`${getStatusColor(status)} text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-pink-400 border border-pink-400`}>{status}</span>
        {/* Status Dropdown
        {status}
        <select
          value={status}
          onChange={handleStatusChange}
          className={`border border-gray-300 text-lg py-1 px-4 rounded ${getStatusColor(status)}`}
        > 
        <option value=''>{status}</option>

          <option value="pending">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select> */}
      </div>

      {/* Product Details */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <img src={`http://${SERVERURL}/media/${order.img}`} alt="Product 1" className="w-full md:w-48 h-48 object-cover rounded-lg" />
          <div className="flex-grow">
            <h3 className="text-xl font-semibold mb-2">{order.product_id__name}</h3>
            <p className="text-muted mb-4">{order.product_id__description}</p>
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">Quantity: {order.quantity}</span>
              <span className="text-lg font-medium">Price: {order.price}</span>
              <span className="text-lg font-bold">Total: {(order.total_product_price)*(order.quantity/250).toFixed(2)}</span>
            </div>
          </div>
        </div>
        <hr />

      </div>

      {/* Order Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-6">
          <h2 className="font-bold text-xl mb-4">Order Summary</h2>
          <p className="text-sm text-gray-500">Placed on {formattedDate(order.created_at)}</p>
          <div className="mt-4 space-y-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${(order.price)*(order.quantity/250).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>$10.00</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>$13.00</span>
            </div>
            <hr />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${(order.price)*(order.quantity/250).toFixed(2)+23}</span>
            </div>
          </div>
        </div>

        {/* Customer Details */}
        <div className="border rounded-lg p-6">
  <h2 className="font-bold text-xl mb-4">Customer Details</h2>
  
  <div className="flex items-center space-x-4">
    <CgProfile size={40} />
    
    <div>
      <p className="font-semibold px-10">
        {order.order_id__address__user__first_name} {order.order_id__address__user__last_name}
      </p>
      
      <p className="text-sm p-2 px-10 text-gray-500">{order.order_id__address__user__email}</p>
      <p className="text-sm p-2 px-10 text-gray-500">+91 {order.order_id__address__user__phone}</p>
      <p className="text-sm p-2 px-10 text-gray-500">{order.order_id__address__user__dob}</p>
      <p className="text-sm p-2 px-10 text-gray-500">{order.order_id__address__user__location} {order.order_id__address__user__state} {order.order_id__address__user__country} {order.order_id__address__user__pin}
      </p>
     

    </div>
  </div>
</div>
   <Userreturncancelmanager status={status} orderId={orderid}/>


        
      </div>

      {/* Address Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Address */}
        <div className="border rounded-lg p-6">
          <h2 className="font-bold text-xl mb-4">Shipping Address</h2>
          <p>{order.order_id__address__user__first_name} {order.order_id__address__user__last_name}</p>
          <p>{order.order_id__address__street_address}</p>
          <p>{order.order_id__address__apartment_address}</p>
          <p>{order.order_id__address__city}</p>
          <p>{order.order_id__address__district}</p>
          
          <p>{order.order_id__address__state}  {order.order_id__address__country} {order.order_id__address__postal_code}  {order.order_id__address__phone_number}</p>
          
        </div>

        {/* Billing Address */}
        <div className="border rounded-lg p-6">
          <h2 className="font-bold text-xl mb-4">Billing Address</h2>
          <p>{order.order_id__address__user__first_name} {order.order_id__address__user__last_name}</p>
          <p>{order.order_id__address__street_address}</p>
          <p>{order.order_id__address__apartment_address}</p>
          <p>{order.order_id__address__city}</p>
          <p>{order.order_id__address__district}</p>
          
          <p>{order.order_id__address__state}  {order.order_id__address__country} {order.order_id__address__postal_code}  {order.order_id__address__phone_number}</p>
          
        </div>
      </div>

      {/* Payment Information */}
      <div className="border rounded-lg p-6">
        <h2 className="font-bold text-xl mb-4">Payment Information</h2>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            {/* <span className="h-5 w-5">💳</span> */}
            <span>{order.paymenttype=='cod'?'cash on delivery':order.paymenttype}</span>
          </div>
          <p>Transaction ID: TRX123456789</p>
        </div>
      </div>

      {/* Order Timeline */}
      <div className="border rounded-lg p-6">
        <h2 className="font-bold text-xl mb-4">Order Timeline</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="text-green-500">✔️</span>
            <span>Order Placed</span>
            <span className="text-sm text-gray-500 ml-auto">{formattedDate(order.created_at)}</span>
          </div>
        </div>
      </div>
      <button className='bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded text-sm transition duration-300 ease-in-out transform hover:scale-105' onClick={()=>window.location='/admin/home/orders'}>go back</button>
    </div>
    </>
  );
}
