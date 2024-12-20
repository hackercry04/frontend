import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import StickyNavbar from '../components/StickyNavbar';
import Userinfo from '../components/profile_components/Userinfo';
import MyOrders from '../components/profile_components/MyOrders';
import ManageAddress from '../components/profile_components/ManageAddress';
import WishList from '../components/profile_components/WishList';
import Wallet from '../components/profile_components/Wallet';
import { CgProfile } from "react-icons/cg";
import { FiPackage, FiMenu } from "react-icons/fi";
import { FaRegAddressBook, FaRegHeart } from "react-icons/fa";
import { TfiWallet } from "react-icons/tfi";
import { IoMdClose } from "react-icons/io";
import axiosInstance from '../components/UserAxios';
import SERVERURL from '../Serverurl';
import UserLogout from '../components/UserLogout';

function Profile() {
  const [userdata, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { page } = useParams();

  useEffect(() => {
    axiosInstance.get(`https://${SERVERURL}/user/profile/details/`)
      .then((res) => {
        setUserData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching user data', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!loading) {
      switch (page) {
        case 'details':
          setContent(<Userinfo data={userdata} />);
          break;
        case 'orders':
          setContent(<MyOrders />);
          break;
        case 'address':
          setContent(<ManageAddress />);
          break;
        case 'wishlist':
          setContent(<WishList />);
          break;
        case 'wallet':
          setContent(<Wallet />);
          break;
        default:
          setContent(<Userinfo data={userdata} />);
          break;
      }
    }
  }, [page, userdata, loading]);

  const handleNavClick = (targetPage) => {
    navigate(`/user/profile/${targetPage}`);
    setIsSidebarOpen(false);
  };

  const NavItem = ({ icon: Icon, label, targetPage }) => (
    <li>
      <button
        className={`w-full text-left px-6 py-4 hover:bg-gray-100 flex items-center space-x-4 transition-colors duration-200 ${page === targetPage ? 'bg-gray-100 text-orange-800' : 'text-gray-700'}`}
        onClick={() => handleNavClick(targetPage)}
      >
        <Icon size={24} />
        <span className="font-medium">{label}</span>
      </button>
    </li>
  );

  const Sidebar = () => (
    <>
      <div className="p-6 border-b">
        <div className="w-20 h-20 mx-auto bg-orange-200 rounded-full flex items-center justify-center mb-4">
          <CgProfile size={40} className="text-white-600" />
        </div>
        <h2 className="text-xl font-semibold text-center text-gray-800">
          {userdata?.User[0]?.first_name || 'User'}
        </h2>
      </div>
      <nav className="mt-4">
        <ul>
          <NavItem icon={CgProfile} label="Profile Overview" targetPage="details" />
          <NavItem icon={FiPackage} label="My Orders" targetPage="orders" />
          <NavItem icon={FaRegAddressBook} label="Manage Address" targetPage="address" />
          <NavItem icon={FaRegHeart} label="My Wishlist" targetPage="wishlist" />
          <NavItem icon={TfiWallet} label="Wallet" targetPage="wallet" />
        </ul>
      </nav>
    </>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <StickyNavbar name={localStorage.getItem('username')} signout={<UserLogout/>} />

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed bottom-4 right-4 z-50 p-4 rounded-full bg-orange-600 text-white shadow-lg lg:hidden"
        aria-label="Toggle Menu"
      >
        {isSidebarOpen ? <IoMdClose size={24} /> : <FiMenu size={24} />}
      </button>

      <div className="flex flex-1 p-4 lg:p-6">
        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar for Desktop */}
        <aside className="hidden lg:block w-64 bg-white shadow-md rounded-lg overflow-hidden">
          <Sidebar />
        </aside>

        {/* Mobile Sidebar */}
        <aside
          className={`fixed top-16 left-0 z-40 w-64 h-[calc(100vh-4rem)] transition-transform duration-300 ease-in-out bg-white shadow-lg transform lg:hidden ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <Sidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-8">
          <div className="bg-white shadow-md rounded-lg p-4 lg:p-8 my-4 lg:my-8">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
              </div>
            ) : (
              content
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Profile;