import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/thumbs';
import 'swiper/css/navigation';
import '../static/styles/ProductPage.css';
import { FaHeart, FaCartPlus } from 'react-icons/fa';
import axiosInstance from '../components/UserAxios';
import SERVERURL from '../Serverurl';
import Reviews from '../components/Reviews';
import { toast, ToastContainer } from 'react-toastify';
import AddtoWishlist from '../wishlist/AddtoWishlist.js';

const ProductPage = (props) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [quantity, setQuantity] = useState(250);
  const [productData, setProductData] = useState({});
  const [productImages, setProductImages] = useState([1,2,3]);
  const [variants, setVariants] = useState([1,2]);
  const [spotLight, setSpotLight] = useState([0,1,2,3]);
  const [stocksize, setStocksize] = useState(0);
  const [cartvarient, setCartv] = useState(null);

  useEffect(() => {
    axiosInstance.get(`https://${SERVERURL}/user/product/get/${props.p_id.id}/`).then((res) => {
      setProductData(res.data.products[0]);
      setProductImages(res.data.product_image);
      setVariants(res.data.varients);
      setSpotLight(['standerd',res.data.products[0].price,res.data.products[0].quantity,res.data.products[0].offer_price]);
      setStocksize(res.data.products[0].quantity);
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
    spaceBetween: 10,
    slidesPerView: 3,
    breakpoints: {
      640: {
        slidesPerView: 4,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 5,
        spaceBetween: 30,
      },
    },
    watchSlidesProgress: true,
    onSwiper: setThumbsSwiper,
  };

  const updateQuantity = (c) => {
    if (quantity + c > stocksize || quantity + c > 5000) {
      toast.error('You exceeded maximum quantity');
      return;
    }
    setQuantity(prev => prev + c);
  };

  const addcart = (quantity, productid, varientid) => {
    if (spotLight[2] < 250 || quantity < 250) {
      toast.error('error: minimum quantity is 250(g)');
      return;
    }
    axiosInstance.post(`https://${SERVERURL}/user/add/cart/`, {
      quantity: quantity,
      product_id: productid,
      varient_id: varientid,
      img: productImages[0].image
    });
    toast.success('item added to cart successfully');
  };

  const goToCheckout = (q, p, v) => {
    if (q < 250 || quantity < 250) {
      toast.error('error: limit exceeded');
      return;
    }
    window.location = `/user/product/cart?quantity=${q}&product_id=${p}&varient_id=${v}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      
      {/* Breadcrumb */}
      <nav className="p-4 text-sm bg-white shadow-sm">
        <ol className="flex items-center space-x-2">
          <li className="flex items-center">
            <a href="/user/home" className="text-gray-600 hover:text-blue-600">Home</a>
          </li>
          <li className="flex items-center">
            <span className="mx-2">/</span>
            <a href={`/user/product/${props.p_id.id}`} className="text-gray-600 hover:text-blue-600">Products</a>
          </li>
          <li className="flex items-center">
            <span className="mx-2">/</span>
            <span className="text-gray-400">{productData.name}</span>
          </li>
        </ol>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <Swiper {...swiperParams} className="rounded-lg overflow-hidden">
              {productImages.map((image, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={`https://${SERVERURL}/media/${image.image}`}
                    alt={`Product ${index + 1}`}
                    className="w-full h-auto object-cover"
                    onClick={() => {
                      setSpotLight(['standerd', productData.price, productData.quantity, productData.offer_price]);
                      setCartv(null);
                      setQuantity(250);
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            
            <Swiper {...thumbsSwiperParams} className="mt-4">
              {productImages.map((image, index) => (
                <SwiperSlide key={`thumb-${index}`}>
                  <img
                    src={`https://${SERVERURL}/media/${image.image}`}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-75"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{productData.name}</h1>
                <p className="text-gray-600 mt-1">({spotLight[0]})</p>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <FaHeart className="text-red-500" size={24} />
                <AddtoWishlist product_id={props.p_id.id} varient_id={cartvarient} image={productImages[0].image} />
              </button>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">${spotLight[1]}</span>
                <span className="text-lg font-medium text-blue-600">Offer: ${spotLight[3]}</span>
              </div>
              
              <div className="inline-flex">
                {spotLight[2] > 249 ? (
                  <span className="px-2.5 py-1 text-xs font-medium text-green-800 bg-green-100 rounded">
                    In Stock: {spotLight[2]}
                  </span>
                ) : (
                  <span className="px-2.5 py-1 text-xs font-medium text-red-800 bg-red-100 rounded">
                    Out of Stock: {spotLight[2]}
                  </span>
                )}
              </div>
            </div>

            {/* Variants */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Variants</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {variants.map((variant, index) => (
                  <div
                    key={index}
                    className="group cursor-pointer"
                    onClick={() => {
                      setSpotLight([variant.name, variant.price, variant.quantity, variant.offer_price]);
                      setCartv(variant.id);
                    }}
                  >
                    <div className="border-2 border-gray-200 rounded-lg p-2 hover:border-blue-500 transition-colors">
                      <img
                        src={`https://${SERVERURL}/media/${variant.image}`}
                        alt={variant.name}
                        className="w-full h-24 object-cover rounded"
                      />
                      <div className="mt-2 text-center">
                        <p className="text-sm text-gray-600 group-hover:text-blue-600">{variant.name}</p>
                        <p className="text-sm font-medium">${variant.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Size (g)</label>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center border border-gray-300 rounded-full">
                  <button
                    onClick={() => setQuantity(prev => Math.max(250, prev - 50))}
                    className="px-4 py-2 rounded-l-full hover:bg-gray-100"
                  >
                    -
                  </button>
                  <input
                    type="text"
                    value={quantity}
                    className="w-20 text-center border-x border-gray-300"
                    readOnly
                  />
                  <button
                    onClick={() => updateQuantity(50)}
                    className="px-4 py-2 rounded-r-full hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => addcart(quantity, props.p_id.id, cartvarient)}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                >
                  <FaCartPlus />
                  Add to Cart
                </button>
              </div>
            </div>

            {/* Size Options */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Size (KG)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[2000, 3000, 4000].map((size) => (
                  <button
                    key={size}
                    onClick={() => spotLight[2] >= size ? setQuantity(size) : toast.error('No enough stock')}
                    className="px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-100"
                  >
                    {size/1000} kg
                  </button>
                ))}
              </div>
            </div>

            {/* Buy Now Button */}
            <button
              onClick={() => goToCheckout(quantity, props.p_id.id, cartvarient)}
              className="w-full py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
            >
              Buy Now
            </button>

            {/* Description */}
            <div className="mt-8 p-4 bg-white rounded-lg shadow-sm">
              <h3 className="font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600">{productData.description}</p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <Reviews />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;