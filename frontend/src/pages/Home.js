import React, { useEffect, useState } from 'react';
import Banner from '../components/Banner';
import StickyNavbar from '../components/StickyNavbar';
import Footer from '../components/Footer';
import Categories from '../components/Categories';
import Pageton from '../components/Pageton';
import ProductCard2 from '../components/ProductCard2';
import logo from '../static/img/dried-dates-kurma.jpg';
import '../static/styles/Home.css';
import ProductSection from '../components/ProductSection';
import UserLogout from '../components/UserLogout';
import axiosInstance from '../components/UserAxios';
import SERVERURL from '../Serverurl';

function Home() {
  const [item,setItem]=useState([])
  const [images,setImages]=useState([])
useEffect(()=>{
axiosInstance.get(`http://${SERVERURL}/user/get_latest_items/`).then((res)=>{

  setItem(res.data.latest)
 



})

},[])
  return (
    <div className="home-page">
                  <StickyNavbar name={localStorage.getItem('username')} signout={<UserLogout/>}/>

      <div className="home-container">
        <Banner />
        <main className="main-content">
          <h1 className="main-title">Explore Our Categories</h1>

          <div className='sub'>

          <Categories />
          </div>
          <div className='main-title'>

          <h1>Our Products</h1>
          </div>

          <ProductSection />
          
          <div className="spacing-section"></div>
          <div className="spacing-section"></div>
          <div className='image'>
            <Pageton />
          </div>
        </main>
        <div className="spacing-section"></div>
          <div className='main-title'>Latest Products</div>
          <div className="w-full overflow-x-auto">
      <div className="flex gap-4 pb-4">
        {item.map((item) => (
          <ProductCard2 
            key={item.product_id}
            id={item.product_id}
            imageUrl={item.image}
            title={item.name}
            price={item.offer_price}
            originalPrice={item.price}
            discount={39}
            className="flex-none w-64" // Fixed width for each card
          />
        ))}
      </div>
    </div>
        <div className="spacing-section"></div>
        <div className="spacing-section"></div>
        <div className="spacing-section"></div>
        <div className="spacing-section"></div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
