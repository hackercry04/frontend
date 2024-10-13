import React, { useEffect, useState } from 'react';
import { IoIosAddCircle } from "react-icons/io";
import axiosInstance from '../UserAxios';
import SERVERURL from '../../Serverurl';
import { toast, ToastContainer } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

function ManageAddress() {
  const [addresses, setAddresses] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
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
  const [formErrors, setFormErrors] = useState({});

  // Handle input changes in form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear the error for this field as the user types
    setFormErrors({ ...formErrors, [name]: '' });
  };

  // Handle adding a new address
  const handleAddAddress = () => {
    setFormVisible(true);
    setIsEditMode(false);
    // Reset the form data when adding a new address
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
    setFormErrors({});
  };

  // Custom confirmation dialog
  const showDeleteConfirmation = (addressId) => {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure you want to delete this address?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => handleDeleteAddress(addressId)
        },
        {
          label: 'No',
          onClick: () => toast.info('Address deletion canceled')
        }
      ]
    });
  };

  // Validate form data
  const validateForm = () => {
    const errors = {};

    // Required fields check
    const requiredFields = [
      'title', 'streetAddress', 'city', 
      'district', 'state', 'country', 
      'postalCode', 'phoneNumber'
    ];
  
    console.log('this is the form data ',formData)
    if (!formData.streetAddress){
      return true
    }
     
    // Title validation (3-50 characters)
    if (formData.title.trim().length < 3 || formData.title.trim().length > 50) {
      errors.title = 'Title must be between 3 and 50 characters.';
    }

    // Street Address validation (5-100 characters)
    if (formData.streetAddress.trim().length < 5 || formData.streetAddress.trim().length > 100) {
      errors.streetAddress = 'Street Address must be between 5 and 100 characters.';
    }

    // City, District, State, Country validation (2-50 characters, letters and spaces only)
    const locationFields = ['city', 'district', 'state', 'country'];
    const locationRegex = /^[A-Za-z\s]{2,50}$/;
    locationFields.forEach(field => {
      if (!locationRegex.test(formData[field].trim())) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} must be 2-50 characters long and contain only letters and spaces.`;
      }
    });

    // Postal Code validation (5-10 alphanumeric characters)
    const postalCodeRegex = /^[A-Za-z0-9]{5,10}$/;
    if (!postalCodeRegex.test(formData.postalCode.trim())) {
      errors.postalCode = 'Postal Code must be 5-10 alphanumeric characters.';
    }

    // Phone number validation (10-15 digits)
    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(formData.phoneNumber.trim())) {
      errors.phoneNumber = 'Phone number must be between 10 and 15 digits.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save or update address
  const handleSaveAddress = async () => {
    if (!validateForm()) return; // Validate the form before saving

    try {
      if (isEditMode) {
        const updatedAddresses = [...addresses];
        updatedAddresses[editIndex] = formData;
        setAddresses(updatedAddresses);

        await axiosInstance.put(`https://${SERVERURL}/user/profile/update/address/`, formData).then((res)=>{


          toast.success('Address updated successfully');
        })
      } else {
        setAddresses([...addresses, formData]);

        await axiosInstance.post(`https://${SERVERURL}/user/profile/add/address/`, formData).then((res)=>{
        
          toast.success('Address added successfully');
        }
        )
      }

      // Reset form after save
      setFormVisible(false);
      setIsEditMode(false);
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
      setFormErrors({});
    } catch (error) {
      console.error(error);
      toast.error('Error saving address');
    }
  };

  // Handle editing an address
  const handleEditAddress = (index) => {
    setEditIndex(index);
    setFormVisible(true);
    setIsEditMode(true);
    setFormData(addresses[index]);
    setFormErrors({});
  };

  // Handle deleting an address
  const handleDeleteAddress = async (index) => {
    try {
      const addressToDelete = addresses[index];
      await axiosInstance.delete(`https://${SERVERURL}/user/profile/delete/address/`, { data: { id: addressToDelete.id } });
      const newAddresses = addresses.filter((_, i) => i !== index);
      setAddresses(newAddresses);
      toast.success('Address deleted successfully');
    } catch (error) {
      console.error(error);
      toast.error('Error deleting address');
    }
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
    setFormErrors({});
  };

  // Fetch addresses on component mount
  useEffect(() => {
    axiosInstance.get(`https://${SERVERURL}/user/profile/get/address/`)
      .then((res) => {
        setAddresses(res.data.adress || []);
        
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <>
    <ToastContainer/>
      <div className="flex items-center text-orange-700 bg-orange-100 p-4">
        <IoIosAddCircle size={45} />
        <button className="ml-2 text-lg" onClick={handleAddAddress}>Add New Address</button>
      </div>

      {formVisible && (
        <div className="address-form p-4 bg-white shadow-lg rounded-lg">
          <h3 className="text-xl mb-4">{isEditMode ? 'Edit Address' : 'Add New Address'}</h3>
          {Object.keys(formData).map((field) => (
            field !== 'id' && (
              <div key={field} className="mb-4">
                <input
                  type="text"
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={formData[field]}
                  onChange={handleInputChange}
                  className={`block w-full p-2 border rounded ${formErrors[field] ? 'border-red-500' : 'border-gray-300'}`}
                  required={field !== 'apartmentAddress'}
                />
                {formErrors[field] && (
                  <p className="text-red-500 text-sm mt-1">{formErrors[field]}</p>
                )}
              </div>
            )
          ))}
          <button
            className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2'
            onClick={handleSaveAddress}
          >
            {isEditMode ? 'Update Address' : 'Save Address'}
          </button>
          <button
            className='text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5'
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      )} 

      <div className="address-list mt-4">
        {addresses.length === 0 ? (
          <p>No addresses available.</p>
        ) : (
          addresses.map((address, index) => (
            <div key={index} className="border p-4 mb-2 rounded-lg shadow-sm">
              <h4 className="font-bold">{address.title}</h4>
              <p>{address.streetAddress}</p>
              <p>{address.apartmentAddress}</p>
              <p>{address.city}, {address.district}, {address.state}, {address.country}, {address.postalCode}</p>
              <p>{address.phoneNumber}</p>
              <button className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 font-medium rounded text-xs px-4 py-1.5 me-2 mb-2 transition-shadow duration-200 ease-in-out shadow-sm hover:shadow-md" onClick={() => handleEditAddress(index)}>
  Edit
</button>
<button className="text-white bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-300 font-medium rounded text-xs px-4 py-1.5 me-2 mb-2 transition-shadow duration-200 ease-in-out shadow-sm hover:shadow-md" onClick={() => showDeleteConfirmation(index)}>
  Delete
</button>

            </div>
          ))
        )}
      </div>
    </>
  );
}

export default ManageAddress;