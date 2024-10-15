import React, { useState, useEffect } from 'react';
import axiosInstance from '../AdminComponents/AdminAxios';
import SERVERURL from '../Serverurl';

const CouponView = () => {
  const [coupons, setCoupons] = useState([]);
  const [error, setError] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'fixed', 'percentage'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchCoupons();
  }, [filter]); // Fetch coupons again when filter changes

  const fetchCoupons = async () => {
    try {
      const response = await axiosInstance.get(`https://${SERVERURL}/admin/get/coupons`);
      let valid = response.data.coupons.filter(coupon => coupon.valid);

      if (filter === 'fixed') {
        valid = valid.filter(coupon => coupon.discountType === 'fixed');
      } else if (filter === 'percentage') {
        valid = valid.filter(coupon => coupon.discountType === 'percentage');
      }

      setCoupons(valid);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      setError('Failed to load coupons. Please try again.');
    }
  };

  const openConfirmModal = (coupon) => {
    setCouponToDelete(coupon);
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setCouponToDelete(null);
  };

  const removeCoupon = async () => {
    if (!couponToDelete) return;

    try {
      const response = await axiosInstance.delete(`https://${SERVERURL}/admin/delete/coupons/${couponToDelete.coupon_id}/`);
      if (response.status !== 204) throw new Error('Failed to delete coupon'); // 204 No Content indicates success
      setCoupons(coupons.filter(coupon => coupon.coupon_id !== couponToDelete.coupon_id));
      closeConfirmModal();
    } catch (error) {
      console.error('Error removing coupon:', error);
      setError('Failed to remove coupon. Please try again.');
    }
  };

  const ConfirmModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-sm w-full">
          <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
          <p className="mb-4">Are you sure you want to delete this coupon?</p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Pagination Logic
  const indexOfLastCoupon = currentPage * itemsPerPage;
  const indexOfFirstCoupon = indexOfLastCoupon - itemsPerPage;
  const currentCoupons = coupons.slice(indexOfFirstCoupon, indexOfLastCoupon);
  const totalPages = Math.ceil(coupons.length / itemsPerPage);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Coupon Management</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="mr-2">Filter by Discount Type:</label>
        <select value={filter} onChange={handleFilterChange} className="border rounded">
          <option value="all">All</option>
          <option value="fixed">Fixed</option>
          <option value="percentage">Percentage</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b">#</th>
              <th className="py-2 px-4 border-b">Code</th>
              <th className="py-2 px-4 border-b">Type</th>
              <th className="py-2 px-4 border-b">Scope</th>
              <th className="py-2 px-4 border-b">Discount</th>
              <th className="py-2 px-4 border-b">Expiry Date</th>
              <th className="py-2 px-4 border-b">Use Count</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCoupons.map((coupon, index) => (
              <tr key={coupon.coupon_id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                <td className="py-2 px-4 border-b">{coupon.code}</td>
                <td className="py-2 px-4 border-b">{coupon.discountType}</td>
                <td className="py-2 px-4 border-b">{coupon.discountSection}</td>
                <td className="py-2 px-4 border-b">
                  {coupon.discountType === 'percentage'
                    ? `${coupon.discountValue}%`
                    : `$${coupon.discountValue}`}
                </td>
                <td className="py-2 px-4 border-b">{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b">{coupon.use_count}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => openConfirmModal(coupon)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {coupons.length === 0 && (
        <p className="text-center mt-4 text-gray-500">No coupons found.</p>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-between mt-4">
        <button onClick={prevPage} disabled={currentPage === 1} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">
          Previous
        </button>
        <span className="self-center">Page {currentPage} of {totalPages}</span>
        <button onClick={nextPage} disabled={currentPage === totalPages} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">
          Next
        </button>
      </div>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmModal}
        onConfirm={removeCoupon}
      />
    </div>
  );
};

export default CouponView;
