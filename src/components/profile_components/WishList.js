import React, { useEffect, useState } from 'react';
import axiosInstance from '../UserAxios';
import SERVERURL from '../../Serverurl';
import { toast, ToastContainer } from 'react-toastify';
import { FaCartPlus } from "react-icons/fa";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  
  useEffect(() => {
    axiosInstance.get(`https://${SERVERURL}/user/get/wishlist/`).then((res) => {
      setWishlistItems(res.data.wishlist);
      console.log(res.data.wishlist);
    });
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(wishlistItems.length / itemsPerPage);

  const removeItem = (id) => {
    axiosInstance.delete(`https://${SERVERURL}/user/delete/wishlist/item/${id}/`).then((res) => {
      toast.success('Removed successfully');
      setWishlistItems(wishlistItems.filter(item => item.id !== id));
    });
  };

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return wishlistItems.slice(startIndex, endIndex);
  };

  const styles = {
    container: {
      width: '100%',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif',
    },
    card: {
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '24px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '16px',
    },
    emptyMessage: {
      textAlign: 'center',
      color: '#666',
    },
    list: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    listItem: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
      borderRadius: '4px',
      padding: '16px',
      marginBottom: '16px',
    },
    image: {
      width: '80px',
      height: '80px',
      objectFit: 'cover',
      borderRadius: '4px',
      marginRight: '16px',
    },
    itemDetails: {
      flexGrow: 1,
    },
    itemName: {
      fontWeight: 'bold',
      marginBottom: '4px',
    },
    itemPrice: {
      fontSize: '14px',
      color: '#666',
    },
    removeButton: {
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      fontSize: '20px',
      color: '#999',
    },
    paginationContainer: {
      display: 'flex',
      justifyContent: 'flex-end', // Align pagination to the right
      alignItems: 'center',
      marginTop: '20px',
    },
    pageButton: {
      padding: '8px 16px',
      backgroundColor: '#f0f0f0',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    disabledButton: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    pageInfo: {
      fontSize: '14px',
      color: '#666',
    },
  };
 const AddtoCart=(imageurl,product_id,product_id__quantity,
  variant_id)=>{

  axiosInstance.post(`https://${SERVERURL}/user/add/cart/`,{
    img:imageurl,
    product_id:product_id,
    quantity:250,
    varient_id:variant_id
  
  }).then(res=>{
    toast.success('item added to cart ')
  }).catch((err)=>{
    toast.error('The item is out of stock')
  })
 }

  return (
    <div style={styles.container}>
      <ToastContainer />
      <div style={styles.card}>
        <h2 style={styles.title}>My Wishlist</h2>
        {wishlistItems.length === 0 ? (
          <p style={styles.emptyMessage}>Your wishlist is empty</p>
        ) : (
          <>
            <ul style={styles.list}>
              {getCurrentPageItems().map((item) => (
                <li key={item.id} style={styles.listItem}>
                  <img src={`https://${SERVERURL}/media/`+(item.variant_id__image || item.imageurl)} alt={item.name} style={styles.image} />
                  <div style={styles.itemDetails}>
                    <h3 style={styles.itemName}>{item.product_id__name} ({item.variant_id__name || 'standard'})</h3>
                    <p style={styles.itemPrice}>${item.variant_id__price || item.product_id__price}</p>
                  </div>
                  <div className='w-1/2 mx-auto'>
                    {item.quantity>=250?
                  <span class="bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">In Stock</span>
                   :
                   <span class="bg-red-100 text-red-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">Out of Stock</span>

              }
                    </div>
                    <a href='#'>

                    <FaCartPlus size={30} className="relative right-12" onClick={()=>AddtoCart(item.imageurl,item.product_id,item.product_id__quantity,
                      item.variant_id
                    )}/>
                    </a>

                  <button
                    style={styles.removeButton}
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.name} from wishlist`}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
            <div style={styles.paginationContainer}>
              <button
                style={{
                  ...styles.pageButton,
                  ...(currentPage === 1 ? styles.disabledButton : {})
                }}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span style={styles.pageInfo}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                style={{
                  ...styles.pageButton,
                  ...(currentPage === totalPages ? styles.disabledButton : {})
                }}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
