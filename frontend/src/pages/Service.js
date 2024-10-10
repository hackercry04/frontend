import React from 'react';
import { FaShippingFast, FaHeadset, FaExchangeAlt, FaShieldAlt } from 'react-icons/fa';
import StickyNavbar from '../components/StickyNavbar';
import Footer from '../components/Footer';

export default function Service() {
  return (
    <>
    <StickyNavbar/>
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-orange-800 mb-12">Our Services</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-orange-200">
            <div className="p-8">
              <div className="flex items-center mb-4">
                <FaShippingFast className="text-3xl text-orange-500 mr-4" />
                <h2 className="text-2xl font-bold text-orange-700">Fast Shipping</h2>
              </div>
              <p className="text-orange-600">
                We offer quick and reliable shipping options to get your products to you as fast as possible. 
                Enjoy free shipping on orders over $50!
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-orange-200">
            <div className="p-8">
              <div className="flex items-center mb-4">
                <FaHeadset className="text-3xl text-orange-500 mr-4" />
                <h2 className="text-2xl font-bold text-orange-700">24/7 Customer Support</h2>
              </div>
              <p className="text-orange-600">
                Our dedicated customer support team is available round the clock to assist you with any 
                questions or concerns you may have about our products or services.
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-orange-200">
            <div className="p-8">
              <div className="flex items-center mb-4">
                <FaExchangeAlt className="text-3xl text-orange-500 mr-4" />
                <h2 className="text-2xl font-bold text-orange-700">Easy Returns</h2>
              </div>
              <p className="text-orange-600">
                Not satisfied with your purchase? No problem! We offer hassle-free returns within 30 days 
                of purchase. Your satisfaction is our top priority.
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-orange-200">
            <div className="p-8">
              <div className="flex items-center mb-4">
                <FaShieldAlt className="text-3xl text-orange-500 mr-4" />
                <h2 className="text-2xl font-bold text-orange-700">Secure Payments</h2>
              </div>
              <p className="text-orange-600">
                Shop with confidence knowing that all your transactions are protected by our 
                state-of-the-art security measures. We support various payment methods for your convenience.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-12 text-center">
          <a 
            href="/contact" 
            className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
            >
            Contact Us for More Information
          </a>
        </div>
      </div>
    </div>
    <Footer/>
              </>
  );
}