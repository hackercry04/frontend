import React, { useState, useEffect } from 'react';
import { FiMenu, FiUser, FiShoppingBag, FiPackage, FiTruck, FiPercent, FiLogOut, FiList } from 'react-icons/fi';
import { RiDashboardLine } from 'react-icons/ri';
import { useNavigate, useParams } from 'react-router-dom';
import Users from '../pages/Users';
import Categories from './Categories';
import Orders from '../AdminComponents/OrderStatus';
import Products from '../pages/ProductList';
import Coupons from './Couponpage';
import Dashboard from './Dashboard';
import CouponView from '../coupon/CouponView';
import NavbarComponent from '../AdminComponents/NavbarComponent';

const menuItems = [
  { icon: RiDashboardLine, label: 'Dashboard', page: 'dashboard' },
  { icon: FiUser, label: 'Users', page: 'users' },
  { icon: FiShoppingBag, label: 'Products', page: 'products' },
  { icon: FiPackage, label: 'Categories', page: 'categories' },
  { icon: FiTruck, label: 'Orders', page: 'orders' },
  { icon: FiPercent, label: 'Coupons', page: 'coupon' },
  { icon: FiList, label: 'Coupon List', page: 'listcoupon' },
  { icon: FiLogOut, label: 'Logout', page: 'logout' }, // Add Logout to menu items
];

export default function AdminHome() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [selectedItem, setSelectedItem] = useState('Dashboard');
  const [pageComponent, setPageComponent] = useState(null);
  const params = useParams();
  const navigate = useNavigate();



  useEffect(() => {
   document.body.style.overflow = 'hidden';
   return () => {
     document.body.style.overflow = 'visible';
   };
 }, []);







  useEffect(() => {
    switch (params.page) {
      case 'users':
        setPageComponent(<Users />);
        break;
      case 'categories':
        setPageComponent(<Categories />);
        break;
      case 'products':
        setPageComponent(<Products />);
        break;
      case 'orders':
        setPageComponent(<Orders />);
        break;
      case 'coupon':
        setPageComponent(<Coupons />);
        break;
      case 'listcoupon':
        setPageComponent(<CouponView />);
        break;
      case 'logout':
         localStorage.removeItem('adminaccesstoken')
         localStorage.removeItem('adminrefreshtoken')
         window.location='/admin/login'
        break;
      default:
        setPageComponent(<Dashboard />);
        break;
    }
  }, [params.page, navigate]);

  const toggleSidebar = () => setIsSidebarExpanded(!isSidebarExpanded);

  return (
    <>
      <NavbarComponent />
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className={`bg-white ${isSidebarExpanded ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out h-full fixed`}>
          <div className="flex items-center justify-between p-4">
            <h1 className={`text-xl font-bold ${isSidebarExpanded ? 'block' : 'hidden'}`}>Admin Panel</h1>
            <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-gray-200">
              <FiMenu size={24} />
            </button>
          </div>
          <nav className="mt-8 overflow-y-auto h-[calc(100vh-64px)]"> {/* Adjust height for scrolling */}
            {menuItems.map((item) => (
              <a
                key={item.label}
                href="#"
                className={`flex items-center p-4 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200 ${
                  selectedItem === item.label ? 'bg-indigo-50 text-indigo-600' : ''
                }`}
                onClick={() => {
                  setSelectedItem(item.label);
                  navigate(`/admin/home/${item.page}`);
                }}
              >
                <item.icon size={24} className="mr-4" />
                {isSidebarExpanded && <span>{item.label}</span>}
              </a>
            ))}
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 p-10 ml-64 h-screen overflow-y-auto"> {/* Add ml-64 to prevent content overlap */}
          {/* <h2 className="text-3xl font-semibold ">{selectedItem}</h2> */}
          <div>{pageComponent}</div>
        </div>
      </div>
    </>
  );
}
