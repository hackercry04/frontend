import React, { useState, useEffect } from 'react';
import axiosInstance from '../AdminComponents/AdminAxios'
import SERVERURL from '../Serverurl';
import { toast, ToastContainer } from 'react-toastify';
const Coupon = () => {
  const [couponType, setCouponType] = useState('store');
  const [couponCode, setCouponCode] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get(`https://${SERVERURL}/admin/get_categories/`);
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories. Please try again.');
    }
  };
  

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get(`https://${SERVERURL}/admin/getproduct/all/`);
      setProducts(response.data.products[0]);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axiosInstance.post(`https://${SERVERURL}/admin/add/coupon/`,{
        couponType,
        couponCode,
        discountType,
        discountValue,
        expiryDate,
        selectedCategory,
        selectedProduct
      }).then((res)=>{
        

        toast.success('coupon added succesfully')
      })
    // Reset form after submission
    resetForm();
  };

  const resetForm = () => {
    setCouponType('store');
    setCouponCode('');
    setDiscountType('percentage');
    setDiscountValue('');
    setExpiryDate('');
    setSelectedCategory(null);
    setSelectedProduct(null);
  };

  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg max-w-md w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{title}</h2>
            <button onClick={onClose} className="text-2xl">&times;</button>
          </div>
          <div className="max-h-96 overflow-y-auto">{children}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create Coupon</h1>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio"
              value="store"
              checked={couponType === 'store'}
              onChange={(e) => setCouponType(e.target.value)}
            />
            <span className="ml-2">Whole Store</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio"
              value="category"
              checked={couponType === 'category'}
              onChange={(e) => setCouponType(e.target.value)}
            />
            <span className="ml-2">Category</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio"
              value="product"
              checked={couponType === 'product'}
              onChange={(e) => setCouponType(e.target.value)}
            />
            <span className="ml-2">Product</span>
          </label>
        </div>

        {couponType === 'category' && (
          <div>
            <label className="block mb-2">Selected Category</label>
            <button
              type="button"
              onClick={() => setIsCategoryModalOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {selectedCategory ? selectedCategory.name : 'Select Category'}
            </button>
            <Modal
              isOpen={isCategoryModalOpen}
              onClose={() => setIsCategoryModalOpen(false)}
              title="Select a Category"
            >
              <div className="grid grid-cols-2 gap-4">
                {categories.map((category) => (
                  <button
                    key={category.category_id}
                    onClick={() => {
                      setSelectedCategory(category);
                      setIsCategoryModalOpen(false);
                    }}
                    className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </Modal>
          </div>
        )}

        {couponType === 'product' && (
          <div>
            <label className="block mb-2">Selected Product</label>
            <button
              type="button"
              onClick={() => setIsProductModalOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {selectedProduct ? selectedProduct.name : 'Select Product'}
            </button>
            <Modal
              isOpen={isProductModalOpen}
              onClose={() => setIsProductModalOpen(false)}
              title="Select a Product"
            >
              <div className="grid grid-cols-2 gap-4">
                {products.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => {
                      setSelectedProduct(product);
                      setIsProductModalOpen(false);
                    }}
                    className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                  >
                    {product.name}
                  </button>
                ))}
              </div>
            </Modal>
          </div>
        )}

        <div>
            <ToastContainer/>
          <label htmlFor="couponCode" className="block mb-2">Coupon Code</label>
          <input
            id="couponCode"
            className="w-full px-3 py-2 border rounded"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-2">Discount Type</label>
          <select
            className="w-full px-3 py-2 border rounded"
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value)}
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
          </select>
        </div>

        <div>
          <label htmlFor="discountValue" className="block mb-2">Discount Value</label>
          <input
            id="discountValue"
            type="number"
            className="w-full px-3 py-2 border rounded"
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="expiryDate" className="block mb-2">Expiry Date</label>
          <input
            id="expiryDate"
            type="date"
            className="w-full px-3 py-2 border rounded"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Coupon
        </button>
      </form>
    </div>
  );
};

export default Coupon;