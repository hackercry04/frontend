// Stepper.js
import React from 'react';
import { FaShoppingCart, FaCreditCard, FaCheckCircle } from 'react-icons/fa';

const Step = ({ status, icon, label, isLast }) => {
  const getStatusClasses = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 border-green-600 bg-green-100';
      case 'current':
        return 'text-blue-500 border-blue-500';
      default:
        return 'text-gray-500 border-gray-300';
    }
  };

  return (
    <li className={`flex items-center ${!isLast ? 'w-full' : ''}`}>
      <span
        className={`flex items-center justify-center w-8 h-8 border-2 rounded-full lg:w-10 lg:h-10 shrink-0 ${getStatusClasses(
          status
        )}`}
      >
        {icon}
      </span>
      <span
        className={`ml-2 text-sm font-medium ${
          status === 'upcoming' ? 'text-gray-500' : 'text-gray-900'
        }`}
      >
        {label}
      </span>
      {!isLast && (
        <div
          className={`flex-1 ml-2 border-t-2 ${
            status === 'completed' ? 'border-green-500' : 'border-gray-300'
          }`}
        ></div>
      )}
    </li>
  );
};

const Stepper = ({ currentStep }) => {
  const steps = [
    { label: 'Cart', icon: <FaShoppingCart className="w-5 h-5" onClick={()=>(window.location.href='/user/cart')} /> },
    { label: 'Pay', icon: <FaCreditCard className="w-5 h-5" /> },
    { label: 'Finish', icon: <FaCheckCircle className="w-5 h-5" /> },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto my-[-40px]">
      <ol className="flex items-center w-full p-3 space-x-2 text-sm font-medium text-center text-gray-500 bg-white rounded-lg sm:text-base sm:p-4 sm:space-x-4">
        {steps.map((step, index) => (
          <Step
            key={index}
            status={
              index < currentStep
                ? 'completed'
                : index === currentStep
                ? 'current'
                : 'upcoming'
            }
            icon={step.icon}
            label={step.label}
            isLast={index === steps.length - 1}
          />
        ))}
      </ol>
    </div>
  );
};

export default Stepper;
