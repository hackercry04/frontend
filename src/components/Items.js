import React from 'react';
import SERVERURL from '../Serverurl';

function Items(props) {
  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700" style={{ width: '300px', height: '400px' }}>
      <a href="#">
        <img 
          className="rounded-t-lg w-full h-2/3 object-cover" 
          src={props.img} 
          alt={props.title} 
          style={{ width: '100%', height: '200px', objectFit: 'cover' }} // Fixed size with aspect ratio cover
        />
      </a>
      <div className="p-5 h-1/3">
        <a href="#">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {props.title}
          </h5>
        </a>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
         Price starts from <strong>{props.price}</strong> rs
        </p>
        <a 
          href={`/user/product/${props.id}`} 
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Go To Product
          <svg 
            className="rtl:rotate-180 w-3.5 h-3.5 ms-2" 
            aria-hidden="true" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 14 10"
          >
            <path 
              stroke="currentColor" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}

export default Items;
