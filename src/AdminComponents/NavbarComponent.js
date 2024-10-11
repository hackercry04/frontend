import React from 'react';
import { FaUserShield } from 'react-icons/fa'; // Importing an admin icon
import logo from '../static/img/logo-removebg.png'; // Importing the logo image

const NavbarComponent = () => {
  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900 h-16 relative"> {/* Set to relative for positioning */}
      <img
        src={logo}
        alt="Logo"
        className="absolute left-0 h-[100px]  w-auto ml-2 my-[-10px]"
        onClick={()=>window.location='/admin/home/dashboard/'} // Position logo at the far left
      /> 

      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4 h-full">
        {/* Title in the middle */}
        <span className="text-2xl font-semibold dark:text-white ml-[120px]"> {/* Added margin to prevent overlap with logo */}
          Admin Dashboard
        </span>

        {/* Admin name and icon on the right */}
        <div className="flex items-center space-x-3">
          <span className="text-lg font-medium dark:text-white">
            Welcome Admin
          </span>
          <FaUserShield className="text-gray-900 dark:text-white h-6 w-6" />
        </div>
      </div>
    </nav>
  );
};

export default NavbarComponent;
