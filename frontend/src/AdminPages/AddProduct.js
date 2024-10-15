import React, { useState, useEffect } from 'react';
import axiosInstance from '../AdminComponents/AdminAxios';
import url from '../Serverurl';
import { toast, ToastContainer } from 'react-toastify';
import NavbarComponent from '../AdminComponents/NavbarComponent';

function AddProduct() {
  const [formData, setFormData] = useState({
    name: '',
    offerprice: '',
    price: '',
    category: '',
    itemWeight: '',
    quantity: '',
    description: '',
    variant1Name: '',
    variant1Image: null,
    variant1Price: 0,
    variant1_offer_Price: null,
    variant1Quantity: 0,
    variant2Name: '',
    variant2Image: null,
    variant2Price: 0,
    variant2Quantity: 0,
    variant2_offer_Price: null,

  });
  const [productImages, setProductImages] = useState([]);
  const [variantImagePreviews, setVariantImagePreviews] = useState({
    variant1: '',
    variant2: '',
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axiosInstance.get(`https://${url}/admin/get_categories/`)
      .then((res) => setCategories(res.data.categories))
      .catch((error) => console.error('Error fetching categories:', error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageUpload = (e, type) => {
    if (type === 'product') {
      const files = Array.from(e.target.files);
      const newImages = files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setProductImages((prevImages) => [...prevImages, ...newImages]);
    } else if (type === 'variant1' || type === 'variant2') {
      const file = e.target.files[0];
      if (file) {
        const preview = URL.createObjectURL(file);
        setFormData((prevData) => ({
          ...prevData,
          [`${type}Image`]: file,
        }));
        setVariantImagePreviews((prevPreviews) => ({
          ...prevPreviews,
          [type]: preview,
        }));
      }
    }
  };

  const handleImageRemove = (index, type) => {
    if (type === 'product') {
      setProductImages((prevImages) => prevImages.filter((_, i) => i !== index));
    } else if (type === 'variant1' || type === 'variant2') {
      setVariantImagePreviews((prevPreviews) => ({
        ...prevPreviews,
        [type]: '',
      }));
      setFormData((prevData) => ({
        ...prevData,
        [`${type}Image`]: null,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) {
        formDataToSend.append(key, formData[key]);
      }
    });

    productImages.forEach((image, index) => {
      formDataToSend.append(`image${index + 1}`, image.file);
    });

    if ((formData.variant1Name !== '' && formData.variant1Image !== null) || (formData.variant2Name !== '' && formData.variant2Image !== null) || (formData.variant1Name === '' && formData.variant1Image === null) || (formData.variant2Name === '' && formData.variant2Image === null)) {
      try {
        const response = await axiosInstance.post(`https://${url}/admin/add/`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }).then(()=>{


          toast.success('product added successfully ')
        }).catch((err)=>{
             
             toast.error(err.response.data.error)

        })
        console.log('Product added successfully:', response.data);
        // Reset form or redirect user after successful submission
      } catch (error) {
        console.error('Error adding product:', error);
      }
    } else {
      alert('Check your form');
    }
  };

  return (
    <div>
      <NavbarComponent/>
      <ToastContainer/>
      <section className="bg-white dark:bg-gray-900">
        <div className="max-w-2xl px-4 py-8 mx-auto lg:py-16">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Add Product</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
              <div className="sm:col-span-2">
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Product Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Type product name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="w-full">
                <label htmlFor="offerprice" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Offer price</label>
                <input
                  type="number"
                  name="offerprice"
                  id="offerprice"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Offer price"
                  required
                  value={formData.offerprice}
                  onChange={handleInputChange}
                />
              </div>
              <div className="w-full">
                <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
                <input
                  type="number"
                  name="price"
                  id="price"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="$299"
                  required
                  value={formData.price}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
                <select
                  id="category"
                  name="category"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.category_id} value={cat.category_id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="itemWeight" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Item Weight (kg)</label>
                <input
                  type="number"
                  name="itemWeight"
                  id="itemWeight"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Ex. 12"
                  required
                  value={formData.itemWeight}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="quantity" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  id="quantity"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Ex. 12"
                  required
                  value={formData.quantity}
                  onChange={handleInputChange}
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Write a description..."
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Product Images</label>
              <input
                type="file"
                multiple
                onChange={(e) => handleImageUpload(e, 'product')}
                className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {productImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img src={image.preview} alt={`Product preview ${index}`} className="w-20 h-20 object-cover" />
                    <button
                      type="button"
                      onClick={() => handleImageRemove(index, 'product')}
                      className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="variant1Name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Variant 1 Name</label>
              <input
                type="text"
                name="variant1Name"
                id="variant1Name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Type variant 1 name"
                value={formData.variant1Name}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="variant1Image" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Variant 1 Image</label>
              <input
                type="file"
                id="variant1Image"
                onChange={(e) => handleImageUpload(e, 'variant1')}
                className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              />
              {variantImagePreviews.variant1 && (
                <div className="relative mt-2">
                  <img src={variantImagePreviews.variant1} alt="Variant 1 preview" className="w-20 h-20 object-cover" />
                  <button
                    type="button"
                    onClick={() => handleImageRemove(null, 'variant1')}
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"
                  >
                    &times;
                  </button>
                </div>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="variant1Price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Variant 1 Price</label>
              <input
                type="number"
                name="variant1Price"
                id="variant1Price"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Type variant 1 price"
                value={formData.variant1Price}
                onChange={handleInputChange}
              />
                            <div className="w-full">
                <label htmlFor="variant1_offer_Price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Offer price</label>
                <input
                  type="number"
                  name="variant1_offer_Price"
                  id="variant1_offer_Price"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Offer price"
                  required
                  value={formData.variant1_offer_Price}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="variant1Quantity" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Variant 1 Quantity</label>
              <input
                type="number"
                name="variant1Quantity"
                id="variant1Quantity"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Type variant 1 quantity"
                value={formData.variant1Quantity}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="variant2Name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Variant 2 Name</label>
              <input
                type="text"
                name="variant2Name"
                id="variant2Name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Type variant 2 name"
                value={formData.variant2Name}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="variant2Image" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Variant 2 Image</label>
              <input
                type="file"
                id="variant2Image"
                onChange={(e) => handleImageUpload(e, 'variant2')}
                className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              />
              {variantImagePreviews.variant2 && (
                <div className="relative mt-2">
                  <img src={variantImagePreviews.variant2} alt="Variant 2 preview" className="w-20 h-20 object-cover" />
                  <button
                    type="button"
                    onClick={() => handleImageRemove(null, 'variant2')}
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"
                  >
                    &times;
                  </button>
                </div>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="variant2Price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Variant 2 Price</label>
              <input
                type="number"
                name="variant2Price"
                id="variant2Price"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Type variant 2 price"
                value={formData.variant2Price}
                onChange={handleInputChange}
              />
            </div>

            <div className="w-full">
                <label htmlFor="variant2_offer_Price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Offer price</label>
                <input
                  type="number"
                  name="variant2_offer_Price"
                  id="variant2_offer_Price"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Offer price"
                  required
                  value={formData.variant2_offer_Price}
                  onChange={handleInputChange}
                />
              </div>
            <div className="mb-4">
              <label htmlFor="variant2Quantity" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Variant 2 Quantity</label>
              <input
                type="number"
                name="variant2Quantity"
                id="variant2Quantity"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Type variant 2 quantity"
                value={formData.variant2Quantity}
                onChange={handleInputChange}
              />
            </div>
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Add Product
            </button>
            &nbsp;&nbsp;
            <button
              type="submit"
              className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
               onClick={()=>window.location='/admin/home/products/'}>
              Go back
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default AddProduct;
