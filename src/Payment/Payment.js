import React, { useState } from 'react';
import SERVERURL from '../Serverurl'; // Make sure SERVERURL is properly defined
import axiosInstance from '../components/UserAxios'; // Ensure axiosInstance is set up correctly
import { ToastContainer,toast } from 'react-toastify';
const Payment = (props) => {
  const [amount, setAmount] = useState('');

  // Function to load the Razorpay script dynamically
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        console.log("Razorpay SDK loaded successfully.");
        resolve(true);
      };
      script.onerror = () => {
        console.error('Razorpay SDK failed to load.');
        toast.error('Razorpay SDK failed to load. Are you online?');
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  // Function to handle the payment process
  const handlePayment = async () => {
    if (props.addrid===0 || props.addrid==''){

      toast.error('please select an address')
      return 
    }
    console.log("Payment initiated");

    // Load the Razorpay SDK script
    const loaded = await loadRazorpay();
    console.log("Razorpay script loaded:", loaded);
    
    if (!loaded) return; // Exit if script loading fails

    try {
      console.log("Sending request to backend to create an order...");

      // Request backend to create a new order
      const result = await axiosInstance.post(`http://${SERVERURL}/user/new_order/`, { amount:props.amount });

      console.log("Backend response:", result.data);

      if (!result.data) {
        toast.error('Server error. No order created.');
        return;
      }

      // Destructure response data from backend
      const { amount: orderAmount, razorpay_order_id, currency, key } = result.data;

      // Options for Razorpay payment modal
      const options = {
        key: key,
        amount: orderAmount,
        currency: currency,
        name: 'Your Company', // Customize as needed
        description: 'Test Transaction',
        order_id: razorpay_order_id,
        handler: function (response) {
     

          axiosInstance.post(`http://${SERVERURL}/user/verify_payment`,{
            razorpay_payment_id:response.razorpay_payment_id,
            razorpay_order_id:response.razorpay_order_id,
            razorpay_signature:response.razorpay_signature,
            address_id:props.addrid,
            products:props.datatosend,
            paymenttype:'upi',
            coupon:props.couponCode,


          }).then((res)=>{


            window.location='/user/order/success'
          }).catch((e)=>{


            toast.error('something went wrong')

          })
        },
        prefill: {
          name: 'Your Name', // Customize as needed
          email: 'youremail@example.com', // Customize as needed
          contact: '9999999999' // Customize as needed
        },
        theme: {
          color: '#3399cc' // Customize as needed
        }
      };

      // Open the Razorpay payment modal
      console.log("Opening Razorpay payment modal...");
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Error occurred during the payment process:', error);
      toast.error('Something went wrong while creating an order. Please try again.');
    }
  };

  return (
    <div>
      <ToastContainer/>

      <button class="flex w-full items-center justify-center rounded-lg bg-green-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-green-800" onClick={handlePayment}>Pay Now</button>
    </div>
  );
};

export default Payment;
