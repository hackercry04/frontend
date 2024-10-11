import React from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import StickyNavbar from '../components/StickyNavbar';
import Footer from '../components/Footer';

export default function Contact() {
  return (<>
  <StickyNavbar/>
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden md:max-w-2xl">
        <div className="md:flex">
          <div className="p-8 bg-orange-200 text-white md:flex-shrink-0 md:w-1/3">
            <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
            <div className="flex items-center mb-4">
              <FaEnvelope className="mr-2" />
              <span>contact@example.com</span>
            </div>
            <div className="flex items-center mb-4">
              <FaPhone className="mr-2" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center">
              <FaMapMarkerAlt className="mr-2" />
              <span>123 Ecommerce St, City, Country</span>
            </div>
          </div>
          <div className="p-8 md:w-2/3">
            <form>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-orange-900"
                  required
                  />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-orange-700"
                  required
                  />
              </div>
              <div className="mb-4">
                <label htmlFor="message" className="block text-gray-700 font-bold mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-orange-700"
                  required
                  ></textarea>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
                  >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
                    </>
  );
}