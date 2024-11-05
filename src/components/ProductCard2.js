import React from 'react';
import SERVERURL from '../Serverurl';

const ProductCard2 = ({ id, imageUrl, title, rating, price, originalPrice, onAddToCart }) => {
  return (
    <div className="transform transition-all duration-300 hover:scale-105">
      <div className="relative mx-auto w-full max-w-[280px] overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl">
        <div className="relative">
          <img 
            className="h-[200px] w-full rounded-t-xl object-cover transition-transform duration-300 hover:scale-110" 
            src={`https://${SERVERURL}/media/${imageUrl}`} 
            alt={title}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          <span className="absolute left-0 top-4 -rotate-45 bg-black px-4 py-1 text-xs font-semibold text-white shadow-md">
            Sale
          </span>
        </div>
        
        <div className="p-4">
          <h5 className="mb-2 line-clamp-2 min-h-[48px] text-lg font-bold text-gray-900">
            {title}
          </h5>
          
          <div className="mb-4 flex items-baseline space-x-2">
            <span className="text-xl font-bold text-gray-900">
              ${parseFloat(price).toFixed(2)}
            </span>
            {originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${parseFloat(originalPrice).toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={() => window.location = `/user/product/${id}`}
            className="group relative w-full overflow-hidden rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:bg-gray-800 active:scale-95"
          >
            <div className="relative flex items-center justify-center">
              <span className="mr-2">View Product</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
                />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard2;