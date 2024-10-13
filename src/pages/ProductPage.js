import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/thumbs';
import 'swiper/css/navigation';
import '../static/styles/ProductPage.css'
import { FaHeart, FaCartPlus } from 'react-icons/fa';
import axiosInstance from '../components/UserAxios';
import SERVERURL from '../Serverurl';
import Reviews from '../components/Reviews';
import { toast, ToastContainer } from 'react-toastify';
import AddtoWishlist from '../wishlist/AddtoWishlist.js'

const ProductPage = (props) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [quantity, setQuantity] = useState(250);
  const [productData, setProductData] = useState({});
  const [productImages, setProductImages] = useState([1,2,3]);
  const [variants, setVariants] = useState([1,2]);
  const [spotLight,setSpotLight]=useState([0,1,2,3])
  const [stocksize,setStocksize]=useState(0)
  const [cartvarient,setCartv]=useState(null)
  useEffect(() => {
    axiosInstance.get(`http://${SERVERURL}/user/product/get/${props.p_id.id}/`).then((res) => {
      setProductData(res.data.products[0]); // Assuming the product data is the first item in the array
      setProductImages(res.data.product_image);
      setVariants(res.data.varients);
      console.log(res.data.products[0].offer_price)
      setSpotLight(['standerd',res.data.products[0].price,res.data.products[0].quantity,res.data.products[0].offer_price])
      setStocksize(res.data.products[0].quantity)
    });
  }, [props.p_id.id]);

  const swiperParams = {
    modules: [Thumbs, Navigation],
    slidesPerView: 1,
    thumbs: { swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null },
    navigation: true,
  };

  const thumbsSwiperParams = {
    modules: [Thumbs],
    spaceBetween: 30,
    slidesPerView: 5,
    watchSlidesProgress: true,
    onSwiper: setThumbsSwiper,
  };

  const updateQuantity=(c)=>{
    if (quantity+c>stocksize || quantity+c>5000)
    {
      toast.error('You eceeded maximum quantity')
      return 
    }
    setQuantity(prev => prev + c)
  }


  function addcart(quantity,productid,varientid){
    if (spotLight[2]<250 || quantity<250){

      toast.error('error:minimum quantity is 250(g)')
      return 
    }

    axiosInstance.post(`http://${SERVERURL}/user/add/cart/`,{

      quantity:quantity,
      product_id:productid,
      varient_id:varientid,
      img:productImages[0].image
    })
      

    toast.success('item added to cart successfully ')
    

    
  }
  const goToCheckout=(q,p,v)=>{
    if (q<250 || quantity<250 ){
    toast.error('error: limit exceeded')
    return 
    }
  
    window.location=`/user/product/cart?quantity=${q}&product_id=${p}&varient_id=${v}`
  }
  return (
    <>
    <ToastContainer/>

{console.log(variants)}
<nav class="flex px-5 py-3 text-gray-700 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700" aria-label="Breadcrumb">
  <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
    <li class="inline-flex items-center">
      <a href="/user/home" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
        <svg class="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
        </svg>
        Home
      </a>
    </li>
    <li>
      <div class="flex items-center">
        <svg class="rtl:rotate-180 block w-3 h-3 mx-1 text-gray-400 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
        </svg>
        <a href={`/user/product/${props.p_id.id}`} class="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">Products</a>
      </div>
    </li>
    <li aria-current="page">
      <div class="flex items-center">
        <svg class="rtl:rotate-180  w-3 h-3 mx-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
        </svg>
        <span class="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">{productData.name}</span>
      </div>
    </li>
  </ol>
</nav>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="slider-box w-full h-full max-lg:mx-auto mx-0">
            <Swiper {...swiperParams} className="main-slide-carousel swiper-container relative mb-6">
  <SwiperSlide key="0">
    <div className="block">
      <img src={`http://${SERVERURL}/media/${productImages[0].image}`} alt="Product image 0" className="max-lg:mx-auto rounded-2xl" id="zoom"  onClick={()=>(setSpotLight(['standerd',productData.price,productData.quantity,productData.offer_price]),setCartv(null),setQuantity(250))}/>
    </div>
  </SwiperSlide>
  <SwiperSlide key="1">
    <div className="block">
      <img src={`http://${SERVERURL}/media/${productImages[1].image}`} alt="Product image 1" className="max-lg:mx-auto rounded-2xl" id="zoom" />
    </div>
  </SwiperSlide>
  <SwiperSlide key="2">
    <div className="block">
      <img src={`http://${SERVERURL}/media/${productImages[2].image}`} alt="Product image 2" className="max-lg:mx-auto rounded-2xl" id="zoom" />
    </div>
  </SwiperSlide>
</Swiper>

<Swiper {...thumbsSwiperParams} className="nav-for-slider">
  <SwiperSlide key="thumb-1" className="thumbs-slide">
    <img src={`http://${SERVERURL}/media/${productImages[0].image}`} alt="Thumbnail image 1" className="cursor-pointer rounded-xl transition-all duration-500 border hover:border-indigo-600" />
  </SwiperSlide>
  <SwiperSlide key="thumb-2" className="thumbs-slide">
    <img src={`http://${SERVERURL}/media/${productImages[1].image}`} alt="Thumbnail image 2" className="cursor-pointer rounded-xl transition-all duration-500 border hover:border-indigo-600" />
  </SwiperSlide>
  <SwiperSlide key="thumb-3" className="thumbs-slide">
    <img src={`http://${SERVERURL}/media/${productImages[2].image}`} alt="Thumbnail image 3" className="cursor-pointer rounded-xl transition-all duration-500 border hover:border-indigo-600" />
  </SwiperSlide>
</Swiper>

            </div>
            <div className="flex justify-center items-center">
              <div className="pro-detail w-full max-lg:max-w-[608px] lg:pl-8 xl:pl-16 max-lg:mx-auto max-lg:mt-8">
                <div className="flex items-center justify-between gap-6 mb-6">
                  <div className="text">
                    <h2 className="font-manrope font-bold text-3xl leading-10 text-gray-900 mb-2">{productData.name}</h2> ({spotLight[0]})
                  </div>
                  <button className="group transition-all duration-500 p-0.5">
                    <FaHeart size={24} color="red" /><AddtoWishlist product_id={props.p_id.id} varient_id={cartvarient} image={productImages[0].image}/>
                  </button>
                </div>

                <div className="flex flex-col min-[400px]:flex-row min-[400px]:items-center mb-8 gap-y-3">
                  <div className="flex items-center">
                    <h5 className="font-manrope font-semibold text-2xl leading-9 text-gray-900">${spotLight[1]}</h5>
                    
                      <span className="ml-3 font-semibold text-lg text-indigo-600">Offer Price: ${spotLight[3]}</span>
                   
                  </div>
                </div>
                {
                  spotLight[2]> 249?
                <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                  In Stock: {spotLight[2]}
                </span>:
                                <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                                Out of Stock: {spotLight[2]}
                              </span>

}
                <br /><br />

                <p className="font-medium text-lg text-gray-900 mb-2">Variants</p>
                <div className="grid grid-cols-3 gap-3 mb-6 max-w-sm">
                
                    <div key='3' className="color-box group">
                      <div>
                        <img src={`http://${SERVERURL}/media/${variants[0].image}`} alt={`varient1`} className="min-[400px]:h-[100px] aspect-square border-2 border-gray-100 rounded-xl transition-all duration-500 group-hover:border-indigo-600" onClick={()=>(setSpotLight([variants[0].name,variants[0].price,variants[0].quantity,variants[0].offer_price]),setCartv(variants[0].id))}/>{/**setQuantity(productData.quantity) */}
                        <p className="font-normal text-sm leading-6 text-gray-400 text-center mt-2 group-hover:text-indigo-600">{variants[0].name}</p>
                        <p className="font-normal text-sm leading-6 text-gray-400 text-center mt-2 group-hover:text-indigo-600">${variants[0].price}</p>
                      </div>
                    </div>
                    <div key='3' className="color-box group">
                      <div>
                        <img src={`http://${SERVERURL}/media/${variants[1].image}`} alt={`varient1`} className="min-[400px]:h-[100px] aspect-square border-2 border-gray-100 rounded-xl transition-all duration-500 group-hover:border-indigo-600"  onClick={()=>(setSpotLight([variants[1].name,variants[1].price,variants[1].quantity,variants[1].offer_price]),setCartv(variants[1].id))}/>
                        <p className="font-normal text-sm leading-6 text-gray-400 text-center mt-2 group-hover:text-indigo-600">{variants[1].name}</p>
                        <p className="font-normal text-sm leading-6 text-gray-400 text-center mt-2 group-hover:text-indigo-600">${variants[1].price}</p>
                      </div>
                    </div>
               
                </div>
               {console.log('this is the spot light ',spotLight)}
                <div className="flex items-center flex-col min-[400px]:flex-row gap-3 mb-3 min-[400px]:mb-8">
                  size (g)
                  <div className="flex items-center justify-center border border-gray-400 rounded-full">
                    <button onClick={() => setQuantity(prev => Math.max(250, prev - 50))} className="group py-[14px] px-3 w-full border-r border-gray-400 rounded-l-full h-full flex items-center justify-center bg-white shadow-sm shadow-transparent transition-all duration-300 hover:bg-gray-50 hover:shadow-gray-300">
                      -
                    </button>
                    <input
                      type="text"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) ||0)}
                      className="font-semibold text-gray-900 text-lg py-3 px-2 w-full min-[400px]:min-w-[75px] h-full bg-transparent placeholder:text-gray-900 text-center hover:text-indigo-600 outline-0 hover:placeholder:text-indigo-600"
                    disabled='true'/>
                    <button onClick={() => updateQuantity(50)} className="group py-[14px] px-3 w-full border-l border-gray-400 rounded-r-full h-full flex items-center justify-center bg-white shadow-sm shadow-transparent transition-all duration-300 hover:bg-gray-50 hover:shadow-gray-300">
                      +
                    </button>
                  </div>
                  <button className="group py-3 px-5 rounded-full bg-indigo-50 text-indigo-600 font-semibold text-lg w-full flex items-center justify-center gap-2 shadow-sm shadow-transparent transition-all duration-500 hover:shadow-indigo-300 hover:bg-indigo-100" onClick={()=>addcart(quantity,props.p_id.id,cartvarient)}>
                    <FaCartPlus size={24} color="black" />
                    Add to cart
                  </button>
                  
                </div>
                <p class="font-medium text-lg text-gray-900 mb-2">Size (KG)</p>
                        <div class="grid grid-cols-2 min-[400px]:grid-cols-4 gap-3 mb-3 min-[400px]:mb-8">
                         
                            <button
                                class="border border-gray-200 whitespace-nowrap text-gray-900 text-sm leading-6 py-2.5 rounded-full px-5 text-center w-full font-semibold shadow-sm shadow-transparent transition-all duration-300 hover:bg-gray-50 hover:shadow-gray-300" onClick={()=>{spotLight[2]>=2000?setQuantity(2000):toast.error('No enough stock')}}>
                                2 kg</button>
                            <button
                                class="border border-gray-200 whitespace-nowrap text-gray-900 text-sm leading-6 py-2.5 rounded-full px-5 text-center w-full font-semibold shadow-sm shadow-transparent transition-all duration-300 hover:bg-gray-50 hover:shadow-gray-300" onClick={()=>spotLight[2]>=3000?setQuantity(3000):toast.error('No enough stock')}>
                                3 kg</button>
                            <button
                                class="border border-gray-200 whitespace-nowrap text-gray-900 text-sm leading-6 py-2.5 rounded-full px-5 text-center w-full font-semibold shadow-sm shadow-transparent transition-all duration-300 hover:bg-gray-50 hover:shadow-gray-300" onClick={()=>spotLight[2]>=4000?setQuantity(4000):toast.error('No enough stock')}>
                                4 kg</button>
                        </div>
                <button className="text-center w-full px-5 py-4 rounded-[100px] bg-indigo-600 flex items-center justify-center font-semibold text-lg text-white shadow-sm shadow-transparent transition-all duration-500 hover:bg-indigo-700 hover:shadow-indigo-300" onClick={()=>goToCheckout(quantity,props.p_id.id,cartvarient)}>
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <div style={{ position: "relative", right: -1050, top: -70 }}>
        <div className="max-w-lg p-7 bg-white border rounded-md">
          <ul>
          <p className="font-normal text-base text-gray-500">{productData.description}</p>

          </ul>
        </div>
      </div>

      {/* Reviews Component */}
      <Reviews />
    </>
  );
};

export default ProductPage;
