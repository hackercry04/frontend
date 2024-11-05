import React, { useEffect, useState } from 'react';
import { AiOutlineShoppingCart, AiOutlineHeart, AiOutlineUser } from 'react-icons/ai';
import logo from '../static/img/logo.png';
import '../static/styles/navbar.css';
import axiosInstance from './UserAxios';
import SERVERURL from '../Serverurl';
import UserAuth from './UserAuth.';

function StickyNavbar(props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [count, setCount] = useState(0);
  const flag = UserAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    if (flag) {
      axiosInstance.get(`https://${SERVERURL}/user/get/cart/item/count/`)
        .then((res) => setCount(res.data.count))
        .catch((e) => console.error('Error fetching cart count:', e));
    }
  }, [flag]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FDE8DE] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/user/home" className="block">
              <img 
                src={logo} 
                alt="Logo" 
                className="h-16 w-auto sm:h-20 object-contain transition-transform duration-300 hover:scale-105"
              />
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-orange-900 hover:text-orange-700 hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500 transition-colors duration-200"
              onClick={toggleMenu}
            >
              <span className="sr-only">Open main menu</span>
              <svg 
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg 
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <NavLink href="/user/home">Home</NavLink>
            <NavLink href="/user/filterpage">Products</NavLink>
            <NavLink href="/user/service">Services</NavLink>
            <NavLink href="/user/contact">Contact</NavLink>
          </div>

          {/* User actions */}
          <div className="hidden md:flex items-center space-x-6">
            <UserActions count={count} name={props.name} signout={props.signout} />
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-[#FDE8DE] pb-4`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            <MobileNavLink href="/user/home">Home</MobileNavLink>
            <MobileNavLink href="/user/filterpage">Products</MobileNavLink>
            <MobileNavLink href="/user/service">Services</MobileNavLink>
            <MobileNavLink href="/user/contact">Contact</MobileNavLink>
          </div>
          <div className="px-4 py-3 border-t border-orange-200">
            <UserActions count={count} name={props.name} signout={props.signout} isMobile />
          </div>
        </div>
      </div>
    </nav>
  );
}

// Navigation link component
const NavLink = ({ href, children }) => (
  <a 
    href={href}
    className="text-orange-900 hover:text-orange-700 px-3 py-2 text-lg font-medium transition-colors duration-200 hover:bg-orange-100 rounded-md"
  >
    {children}
  </a>
);

// Mobile navigation link component
const MobileNavLink = ({ href, children }) => (
  <a
    href={href}
    className="text-orange-900 hover:text-orange-700 block px-3 py-2 text-base font-medium rounded-md hover:bg-orange-100 transition-colors duration-200"
  >
    {children}
  </a>
);

// User actions component
const UserActions = ({ count, name, signout, isMobile }) => (
  <div className={`flex items-center ${isMobile ? 'flex-col space-y-4' : 'space-x-6'}`}>
    <div className="flex items-center space-x-4">
      <button 
        onClick={() => window.location='/user/cart'} 
        className="relative p-2 text-orange-900 hover:text-orange-700 transition-colors duration-200"
      >
        <AiOutlineShoppingCart size={24} />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
            {count}
          </span>
        )}
      </button>
      
      <a 
        href='/user/profile/wishlist'
        className="p-2 text-orange-900 hover:text-orange-700 transition-colors duration-200"
      >
        <AiOutlineHeart size={24} />
      </a>
      
      <a 
        href='/user/profile/details'
        className="p-2 text-orange-900 hover:text-orange-700 transition-colors duration-200"
      >
        <AiOutlineUser size={24} />
      </a>
    </div>
    
    <div className={`flex items-center ${isMobile ? 'flex-col' : 'space-x-2'}`}>
      <span className="text-orange-900 font-medium">{name}</span>
      <span className="text-orange-900">{signout}</span>
    </div>
  </div>
);

export default StickyNavbar;