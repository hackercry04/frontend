import React, { useEffect, useState } from 'react';
import { AiOutlineShoppingCart, AiOutlineHeart, AiOutlineUser } from 'react-icons/ai';
import logo from '../static/img/logo.png';
import '../static/styles/navbar.css';
import axiosInstance from './UserAxios';
import SERVERURL from '../Serverurl';
import UserAuth from './UserAuth.';
function StickyNavbar(props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [count,setCount]=useState(0)
 const  flag=UserAuth()
  console.log('flag is fla',flag)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);


useEffect(()=>{
  if (flag){
axiosInstance.get(`https://${SERVERURL}/user/get/cart/item/count/`).then((res)=>
{

 setCount(res.data.count)

}

).catch((e)=>{


  console.log(1)
});

  }

},[])
  return (
    <nav className="bg-[#FDE8DE] h-[120px]">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto px-4 md:px-0 ">
        <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src={logo} alt="Logo" className="w-[230px] h-[170px] rounded-full" />
        </a>
        <div className="flex md:order-2 space-x-3">
          <button
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-controls="navbar-cta"
            aria-expanded={isMenuOpen}
            onClick={toggleMenu}
          >
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
          {/* You can add mobile menu button here if needed */}
        </div>
        <div className={`items-center justify-between bg-[#FDE8DE] hidden w-full md:flex md:w-auto text-xl${isMenuOpen ? 'block' : 'hidden'}`} id="navbar-cta">
          <ul className="flex flex-col md:flex-row md:space-x-8 font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:border-0 m">
            <li>
              <a href="/user/home" className="block bg-[#FDE8DE] py-2 px-3 text-orange-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white dark:hover:bg-gray-700 md:dark:hover:bg-transparent text-xl">Home</a>
            </li>
            <li>
              <a href="/user/filterpage" className="block py-2 bg-[#FDE8DE] px-3 text-orange-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white dark:hover:bg-gray-700 md:dark:hover:bg-transparent text-xl">Products</a>
            </li>
            <li>
              <a href="/user/service" className="block py-2 bg-[#FDE8DE]  px-3 text-orange-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white dark:hover:bg-gray-700 md:dark:hover:bg-transparent text-xl">Services</a>
            </li>
            <li>
              <a href="/user/contact" className="block py-2  bg-[#FDE8DE] px-3 text-orange-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white dark:hover:bg-gray-700 md:dark:hover:bg-transparent text-xl">Contact</a>
            </li>
            <li>
              <div className="py-2 px-10 flex bg-[#FDE8DE] items-center gap-4 text-m" style={{left:-1100}} >
                {/* Cart Icon */}
                <div style={{ position: 'relative', display: 'inline-block' }}>
  <AiOutlineShoppingCart size={25} onClick={() => window.location='/user/cart'} />
    {count!==0&&
  <span style={{
    position: 'absolute',
    top: '-5px',
    right: '-5px',
    backgroundColor: 'red',
    color: 'white',
    borderRadius: '50%',
    padding: '0px 6px',
    fontSize: '13px',
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }}>
    {count  } {/* Example number, like items in the cart */}
  </span>
}
</div>
                
                {/* Heart Icon */}
                <a href='/user/profile/wishlist'>
                <AiOutlineHeart size={25} />
                </a>
                
                {/* User Account Icon */}
               <a href='/user/profile/details'>
                <AiOutlineUser size={25} />
                </a> 
          <div className='text-orange-900 '>

         
          {props.name}
          &nbsp;&nbsp;
          {props.signout}
          </div>
              </div>
              
            </li>
          </ul>
        </div>
        
      </div>
      
    </nav>
  );
}

export default StickyNavbar;
