import React, { useEffect, useState } from 'react';
import { IoIosAddCircle } from "react-icons/io";
import axiosInstance from '../UserAxios';
import SERVERURL from '../../Serverurl';
import { toast } from 'react-toastify';

function ManageAddressForCheckout({ passtheadress }) {
  const [addresses, setAddresses] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    streetAddress: '',
    apartmentAddress: '',
    city: '',
    district: '',
    state: '',
    country: '',
    postalCode: '',
    phoneNumber: ''
  });
  const [selectedAddressId, setSelectedAddressId] = useState(null); // Track selected address ID
  const [errors, setErrors] = useState({}); // Track form validation errors

  // Handle input changes in form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' }); // Clear the error message for the field being updated
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    const regexPhone = /^[0-9]{10}$/; // Simple regex for 10 digit phone numbers
    const regexPostalCode = /^[0-9]{6}$/; // Simple regex for 6 digit postal codes

    if (!formData.title) newErrors.title = 'Title is required.';
    if (!formData.streetAddress) newErrors.streetAddress = 'Street address is required.';
    if (!formData.city) newErrors.city = 'City is required.';
    if (!formData.district) newErrors.district = 'District is required.';
    if (!formData.state) newErrors.state = 'State is required.';
    if (!formData.country) newErrors.country = 'Country is required.';
    if (!formData.postalCode || !regexPostalCode.test(formData.postalCode)) 
      newErrors.postalCode = 'Postal code must be a 6-digit number.';
    if (!formData.phoneNumber || !regexPhone.test(formData.phoneNumber)) 
      newErrors.phoneNumber = 'Phone number must be a 10-digit number.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if there are no errors
  };

  // Handle adding a new address
  const handleAddAddress = () => {
    setFormVisible(true);
    setFormData({
      id: '',
      title: '',
      streetAddress: '',
      apartmentAddress: '',
      city: '',
      district: '',
      state: '',
      country: '',
      postalCode: '',
      phoneNumber: ''
    });
    setErrors({}); // Reset errors when adding a new address
  };

  // Save new address
  const handleSaveAddress = async () => {
    if (!validateForm()) return; // Prevent saving if validation fails

    try {
      setAddresses([...addresses, formData]);
      await axiosInstance.post(`http://${SERVERURL}/user/profile/add/address/`, formData);
     
      toast.success('Address added successfully');
    } catch (error) {
      console.error(error);
      toast.error('Error saving address');
    }

    setFormVisible(false);
    setFormData({
      id: '',
      title: '',
      streetAddress: '',
      apartmentAddress: '',
      city: '',
      district: '',
      state: '',
      country: '',
      postalCode: '',
      phoneNumber: ''
    });
  };

  // Handle form cancel
  const handleCancel = () => {
    setFormVisible(false);
    setFormData({
      id: '',
      title: '',
      streetAddress: '',
      apartmentAddress: '',
      city: '',
      district: '',
      state: '',
      country: '',
      postalCode: '',
      phoneNumber: ''
    });
    setErrors({}); // Reset errors when cancelling
  };

  // Fetch addresses on component mount
  useEffect(() => {
    axiosInstance.get(`http://${SERVERURL}/user/profile/get/address/`)
      .then((res) => {
        setAddresses(res.data.adress || []);
      })
      .catch((error) => console.error(error));
  }, []);

  // Handle checkbox change
  const handleCheckboxChange = (e, addressId) => {
    if (e.target.checked) {
      setSelectedAddressId(addressId);
      passtheadress(addressId)
    } else {
      setSelectedAddressId(null);
    }
  };

  return (
    <>
    
      <div className="flex items-center text-orange-700 bg-orange-100 p-4">
        <IoIosAddCircle size={45} />
        <button className="ml-2 text-lg" onClick={handleAddAddress}>Add New Address</button>
      </div>

      {formVisible && (
        <div className="address-form p-4 bg-white shadow-lg rounded-lg">
          <h3 className="text-xl mb-4">Add New Address</h3>
          {Object.keys(errors).length > 0 && (
            <div className="mb-4 text-red-600">
              {Object.values(errors).map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </div>
          )}
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleInputChange}
            className="block w-full mb-2 p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="streetAddress"
            placeholder="Street Address"
            value={formData.streetAddress}
            onChange={handleInputChange}
            className="block w-full mb-2 p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="apartmentAddress"
            placeholder="Apartment Address (Optional)"
            value={formData.apartmentAddress}
            onChange={handleInputChange}
            className="block w-full mb-2 p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleInputChange}
            className="block w-full mb-2 p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="district"
            placeholder="District"
            value={formData.district}
            onChange={handleInputChange}
            className="block w-full mb-2 p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleInputChange}
            className="block w-full mb-2 p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={formData.country}
            onChange={handleInputChange}
            className="block w-full mb-2 p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="postalCode"
            placeholder="Postal Code"
            value={formData.postalCode}
            onChange={handleInputChange}
            className="block w-full mb-2 p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className="block w-full mb-4 p-2 border border-gray-300 rounded"
          />
          <button
            className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2'
            onClick={handleSaveAddress}
          >
            Save Address
          </button>
          <button
            className='text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5'
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      )}

      <div className="address-list p-4">
        {addresses.map((address) => (
          <div key={address.id} className="address-card p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow">
            <input
              type="checkbox"
              className="checkbox-round"
              checked={selectedAddressId === address.id}
              onChange={(e) => handleCheckboxChange(e, address.id)}
            />
            <h5 className="text-2xl font-bold mb-2">{address.title}</h5>
            <p className="text-gray-700 mb-1">
              {address.streetAddress}
              {address.apartmentAddress && `, ${address.apartmentAddress}`}
            </p>
            <p className="text-gray-700 mb-1">{address.city}, {address.district}, {address.state}</p>
            <p className="text-gray-700 mb-1">{address.country} - {address.postalCode}</p>
            <p className="text-gray-700">Phone: {address.phoneNumber}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default ManageAddressForCheckout;
