import React, { useEffect, useState } from 'react';
import { IoIosAddCircle } from "react-icons/io";
import axiosInstance from '../UserAxios';
import SERVERURL from '../../Serverurl';
import { toast, ToastContainer } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const AddressCard = ({ address, onEdit, onDelete }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
    <h4 className="font-bold text-lg mb-2">{address.title}</h4>
    <div className="space-y-1 text-gray-600 text-sm md:text-base mb-4">
      <p>{address.streetAddress}</p>
      {address.apartmentAddress && <p>{address.apartmentAddress}</p>}
      <p>{address.city}, {address.district}</p>
      <p>{address.state}, {address.country}</p>
      <p>PIN: {address.postalCode}</p>
      <p className="font-medium">Phone: {address.phoneNumber}</p>
    </div>
    <div className="flex flex-wrap gap-2">
      <button 
        className="flex-1 sm:flex-none text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 font-medium rounded px-4 py-2 text-sm transition-all duration-200"
        onClick={onEdit}
      >
        Edit
      </button>
      <button 
        className="flex-1 sm:flex-none text-white bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-300 font-medium rounded px-4 py-2 text-sm transition-all duration-200"
        onClick={onDelete}
      >
        Delete
      </button>
    </div>
  </div>
);

const AddressForm = ({ formData, formErrors, isEditMode, onInputChange, onSave, onCancel }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
    <h3 className="text-xl font-semibold mb-6">{isEditMode ? 'Edit Address' : 'Add New Address'}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.keys(formData).map((field) => (
        field !== 'id' && (
          <div key={field} className={field === 'streetAddress' ? 'md:col-span-2' : ''}>
            <input
              type="text"
              name={field}
              placeholder={field.split(/(?=[A-Z])/).join(' ')}
              value={formData[field]}
              onChange={onInputChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-200 ${
                formErrors[field] ? 'border-red-500' : 'border-gray-300'
              }`}
              required={field !== 'apartmentAddress'}
            />
            {formErrors[field] && (
              <p className="text-red-500 text-sm mt-1">{formErrors[field]}</p>
            )}
          </div>
        )
      ))}
    </div>
    <div className="flex flex-col sm:flex-row gap-3 mt-6">
      <button
        className="w-full sm:w-auto text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-6 py-2.5 text-sm transition-all duration-200"
        onClick={onSave}
      >
        {isEditMode ? 'Update Address' : 'Save Address'}
      </button>
      <button
        className="w-full sm:w-auto text-gray-700 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg px-6 py-2.5 text-sm transition-all duration-200"
        onClick={onCancel}
      >
        Cancel
      </button>
    </div>
  </div>
);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: '' });
  };

  const handleAddAddress = () => {
    setFormVisible(true);
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
  };

  const showDeleteConfirmation = (addressId) => {
    confirmAlert({
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete this address?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => handleDeleteAddress(addressId),
          className: 'bg-red-600 text-white'
        },
        {
          label: 'No',
          onClick: () => toast.info('Address deletion canceled'),
          className: 'bg-gray-500 text-white'
        }
      ],
      closeOnEscape: true,
      closeOnClickOutside: true,
      overlayClassName: "confirm-alert-overlay"
    });
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.streetAddress) {
      return true;
    }
     
    if (formData.title.trim().length < 3 || formData.title.trim().length > 50) {
      errors.title = 'Title must be between 3 and 50 characters.';
    }

    if (formData.streetAddress.trim().length < 5 || formData.streetAddress.trim().length > 100) {
      errors.streetAddress = 'Street Address must be between 5 and 100 characters.';
    }

    const locationFields = ['city', 'district', 'state', 'country'];
    const locationRegex = /^[A-Za-z\s]{2,50}$/;
    locationFields.forEach(field => {
      if (!locationRegex.test(formData[field].trim())) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} must be 2-50 characters long and contain only letters and spaces.`;
      }
    });

    const postalCodeRegex = /^[A-Za-z0-9]{5,10}$/;
    if (!postalCodeRegex.test(formData.postalCode.trim())) {
      errors.postalCode = 'Postal Code must be 5-10 alphanumeric characters.';
    }

    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(formData.phoneNumber.trim())) {
      errors.phoneNumber = 'Phone number must be between 10 and 15 digits.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveAddress = async () => {
    if (!validateForm()) return;

    try {
      if (isEditMode) {
        const updatedAddresses = [...addresses];
        updatedAddresses[editIndex] = formData;
        setAddresses(updatedAddresses);
        await axiosInstance.put(`https://${SERVERURL}/user/profile/update/address/`, formData);
        toast.success('Address updated successfully');
      } else {
        setAddresses([...addresses, formData]);
        await axiosInstance.post(`https://${SERVERURL}/user/profile/add/address/`, formData);
        toast.success('Address added successfully');
      }

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

  const handleEditAddress = (index) => {
    setEditIndex(index);
    setFormVisible(true);
    setIsEditMode(true);
    setFormData(addresses[index]);
    setFormErrors({});
  };

  const handleDeleteAddress = async (index) => {
    try {
      const addressToDelete = addresses[index];
      await axiosInstance.delete(`https://${SERVERURL}/user/profile/delete/address/`, { 
        data: { id: addressToDelete.id } 
      });
      const newAddresses = addresses.filter((_, i) => i !== index);
      setAddresses(newAddresses);
      toast.success('Address deleted successfully');
    } catch (error) {
      console.error(error);
      toast.error('Error deleting address');
    }
  };

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

  useEffect(() => {
    axiosInstance.get(`https://${SERVERURL}/user/profile/get/address/`)
      .then((res) => {
        setAddresses(res.data.adress || []);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <button 
        onClick={handleAddAddress}
        className="w-full sm:w-auto mb-6 flex items-center justify-center sm:justify-start gap-2 text-orange-700 bg-orange-100 hover:bg-orange-200 p-4 rounded-lg transition-colors duration-200"
      >
        <IoIosAddCircle size={24} />
        <span className="text-lg">Add New Address</span>
      </button>

      {formVisible && (
        <div className="mb-8">
          <AddressForm
            formData={formData}
            formErrors={formErrors}
            isEditMode={isEditMode}
            onInputChange={handleInputChange}
            onSave={handleSaveAddress}
            onCancel={handleCancel}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {addresses.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            No addresses available.
          </div>
        ) : (
          addresses.map((address, index) => (
            <AddressCard
              key={index}
              address={address}
              onEdit={() => handleEditAddress(index)}
              onDelete={() => showDeleteConfirmation(index)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default ManageAddress;