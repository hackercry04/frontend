import React, { useState, useEffect } from 'react';
import axiosInstance from './UserAxios';
import Items from '../components/Items';
import logo from '../static/img/dried-dates-kurma.jpg'; // Fallback image
import '../static/styles/Home.css'; // Ensure this CSS file styles the container properly
import SERVERURL from '../Serverurl';

const ProductSection = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axiosInstance.get(`https://${SERVERURL}/user/product/all/`)
      .then(response => {
        console.log(response.data.products[0].product_id)
        const productData = response.data.products.map(product => ({
          id: product.product_id,
          title: product.name,
          description: product.description,
          category: product.category__name,
          price: product.price,
          offerPrice: product.offer_price,
          quantity: product.quantity,
          images: product.img.length > 0 
            ? product.img.map(img => `https://${SERVERURL}/media/` + img.image) 
            : [logo], // Fallback to logo if no images
        }));

        setProducts(productData);
      })
      .catch(error => {
        console.error('There was an error fetching the products!', error);
      });
  }, []);

  return (
    <div className='products' style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
      {products.length > 0 ? (
        products.map(product => (
          <Items
            id={product.id} // Use product ID as the key for each item
            img={product.images[0]}
            title={product.title}
            price={product.offerPrice}
          />
        ))
      ) : (
        <p>Nothing to show</p>
      )}
    </div>
  );
};

export default ProductSection;
