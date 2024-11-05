import React, { useEffect, useState } from 'react';
import axiosInstance from '../UserAxios';
import SERVERURL from '../../Serverurl';
import { toast, ToastContainer } from 'react-toastify';
import { FaCartPlus } from "react-icons/fa";
import { IoCloseCircleOutline } from "react-icons/io5";

const WishlistItem = ({ item, onRemove, onAddToCart }) => (
  <div className="flex flex-col sm:flex-row items-center bg-white rounded-lg shadow-sm p-4 gap-4">
    <img 
      src={`https://${SERVERURL}/media/`+(item.variant_id__image || item.imageurl)} 
      alt={item.name} 
      className="w-32 h-32 object-cover rounded-md"
    />
    
    <div className="flex-1 text-center sm:text-left">
      <h3 className="font-semibold text-gray-800 mb-1">
        {item.product_id__name} 
        <span className="text-sm text-gray-600">
          ({item.variant_id__name || 'standard'})
        </span>
      </h3>
      <p className="text-lg font-medium text-gray-900 mb-2">
        ${item.variant_id__price || item.product_id__price}
      </p>
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
        {item.quantity >= 250 ? (
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded">
            In Stock
          </span>
        ) : (
          <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-1 rounded">
            Out of Stock
          </span>
        )}
      </div>
    </div>

    <div className="flex items-center gap-4">
      <button
        onClick={() => onAddToCart(item)}
        className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
        aria-label="Add to cart"
      >
        <FaCartPlus size={24} />
      </button>
      <button
        onClick={() => onRemove(item.id)}
        className="text-red-500 hover:text-red-700 transition-colors duration-200"
        aria-label="Remove from wishlist"
      >
        <IoCloseCircleOutline size={24} />
      </button>
    </div>
  </div>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex items-center justify-center gap-4 mt-6">
    <button
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200
        ${currentPage === 1 
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
          : 'bg-blue-600 text-white hover:bg-blue-700'}`}
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
    >
      Previous
    </button>
    
    <span className="text-sm text-gray-600">
      Page {currentPage} of {totalPages || 1}
    </span>
    
    <button
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200
        ${currentPage === totalPages || totalPages === 0
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
          : 'bg-blue-600 text-white hover:bg-blue-700'}`}
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages || totalPages === 0}
    >
      Next
    </button>
  </div>
);

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  useEffect(() => {
    fetchWishlistItems();
  }, []);

  const fetchWishlistItems = async () => {
    try {
      const response = await axiosInstance.get(`https://${SERVERURL}/user/get/wishlist/`);
      setWishlistItems(response.data.wishlist);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Failed to load wishlist items');
    }
  };

  const removeItem = async (id) => {
    try {
      await axiosInstance.delete(`https://${SERVERURL}/user/delete/wishlist/item/${id}/`);
      setWishlistItems(wishlistItems.filter(item => item.id !== id));
      toast.success('Item removed from wishlist');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    }
  };

  const addToCart = async (item) => {
    try {
      await axiosInstance.post(`https://${SERVERURL}/user/add/cart/`, {
        img: item.imageurl,
        product_id: item.product_id,
        quantity: 250,
        varient_id: item.variant_id
      });
      toast.success('Item added to cart');
    } catch (error) {
      toast.error('The item is out of stock');
    }
  };

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return wishlistItems.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(wishlistItems.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Wishlist</h2>
        
        {wishlistItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Your wishlist is empty</p>
          </div>
        ) : (
          <div className="space-y-4">
            {getCurrentPageItems().map((item) => (
              <WishlistItem
                key={item.id}
                item={item}
                onRemove={removeItem}
                onAddToCart={addToCart}
              />
            ))}
            
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;