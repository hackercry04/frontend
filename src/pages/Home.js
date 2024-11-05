import React, { useEffect, useState } from 'react';
import Banner from '../components/Banner';
import StickyNavbar from '../components/StickyNavbar';
import Footer from '../components/Footer';
import Categories from '../components/Categories';
import Pageton from '../components/Pageton';
import ProductCard2 from '../components/ProductCard2';
import ProductSection from '../components/ProductSection';
import UserLogout from '../components/UserLogout';
import axiosInstance from '../components/UserAxios';
import SERVERURL from '../Serverurl';

function Home() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLatestItems = async () => {
      try {
        const response = await axiosInstance.get(`https://${SERVERURL}/user/get_latest_items/`);
        setItems(response.data.latest);
      } catch (error) {
        console.error('Error fetching latest items:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestItems();
  }, []);

  // Section title component for reusability
  const SectionTitle = ({ title }) => (
    <div className="mb-12">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800">
        {title}
      </h2>
      <div className="relative">
        <span className="block w-24 h-1 bg-orange-500 mx-auto rounded-full"></span>
        <span className="block w-12 h-1 bg-orange-300 mx-auto mt-1 rounded-full"></span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      <StickyNavbar name={localStorage.getItem('username')} signout={<UserLogout />} />

      <main className="flex-grow pt-20">
        {/* Hero Banner */}
        <div className="mb-12">
          <Banner />
        </div>

        {/* Categories Section */}
        <section className="container mx-auto px-4 py-8">
          <SectionTitle title="Explore Our Categories" />
          <div className="mb-16">
            <Categories />
          </div>

          {/* Products Section */}
          <SectionTitle title="Our Products" />
          <div className="mb-16">
            <ProductSection />
          </div>

          {/* Pageton Section */}
          <div className="my-16">
            <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
              <Pageton />
            </div>
          </div>

          {/* Latest Products Section */}
          <SectionTitle title="Latest Products" />
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 h-64 rounded-lg"></div>
                  <div className="mt-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="relative">
              <div className="overflow-x-auto hide-scrollbar">
                <div className="flex gap-6 pb-6 snap-x snap-mandatory">
                  {items.map((item) => (
                    <div 
                      key={item.product_id} 
                      className="snap-start flex-none w-[280px] first:ml-0 last:mr-0"
                    >
                      <div className="transform transition-all duration-300 hover:scale-105 hover:rotate-1">
                        <ProductCard2
                          id={item.product_id}
                          imageUrl={item.image}
                          title={item.name}
                          price={item.offer_price}
                          originalPrice={item.price}
                          discount={39}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Gradient Shadows for Scroll Indication */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none"></div>
            </div>
          )}
        </section>
      </main>

      <Footer />

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

export default Home;