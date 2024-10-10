import React from 'react';
import SERVERURL from '../Serverurl';

const ProductCard2 = ({id, imageUrl, title, rating, price, originalPrice, onAddToCart }) => {
  return (
    
    <div className="relative m-10 w-full max-w-xs overflow-hidden rounded-lg bg-white shadow-md">
      {console.log(id)}
      <a href="#">
        <img className="h-60 rounded-t-lg object-cover" src={`http://${SERVERURL}/media/${imageUrl}`} alt="product image" />
      </a>
      <span className="absolute top-0 left-0 w-28 translate-y-4 -translate-x-6 -rotate-45 bg-black text-center text-sm text-white">Sale</span>
      <div className="mt-4 px-5 pb-5">
        <a href="#">
          <h5 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h5>
        </a>
        <div className="mt-2.5 mb-5 flex items-center">
          {/* {[...Array(5)].map((_, index) => (
            <svg
              key={index}
              aria-hidden="true"
              className={`h-5 w-5 ${index < rating ? 'text-yellow-300' : 'text-gray-300'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
          ))} */}
        </div>
        <div className="flex items-center justify-between">
          <p>
            <span className="text-3xl font-bold text-slate-900">{price}</span>
            {originalPrice && <span className="text-sm text-slate-900 line-through">{originalPrice}</span>}
          </p>
          <button
            onClick={()=>window.location=`/user/product/${id}`}
            className="flex items-center rounded-md bg-slate-900 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            view
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard2;
