import React, { useState } from 'react';
import axios from 'axios';
import SERVERURL from '../Serverurl';
import axiosInstance from './AdminAxios';
import { toast, ToastContainer } from 'react-toastify';

function Userreturncancelmanager({ status, orderId }) {
  console.log('Status from prop:', status);
  console.log(orderId)
  const [currentStatus, setCurrentStatus] = useState(status);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState({ action: 'approve' });
  const [r,setReload]=useState(true)
  {console.log('this is the status in the props ',status)}

  const handleAction = (action) => {
    setConfirmAction({ action });
    setIsConfirmOpen(true);
  };

  const confirmActionHandler = async () => {
    try {
      const { action } = confirmAction;
      
      // Check if it's a return or cancel request based on current status
      
      const requestType = status.toLowerCase().includes('Return requested') ? 'return' : 'cancel';
      const newStatus = `${requestType} ${action === 'approve' ? 'approved' : 'rejected'}`;

      // Make the API call based on the orderId and action
      await axiosInstance.post(`http://${SERVERURL}/admin/return-cancel-request/${orderId.orderid}/`,{
       status:status,
       action:action

      }).then((res)=>{

        console.log('this sould update the state')
        setReload(!r)
        toast.success('status updated succesfully')
        window.location.reload()
      });
      
      // Update status after the action is confirmed
      setCurrentStatus(newStatus);
      
    //   alert(`Request ${action}d successfully.`);
    } catch (error) {
      console.error(`Failed to ${confirmAction.action} request:`, error);
      alert(`Failed to ${confirmAction.action} request. Please try again.`);
    } finally {
      setIsConfirmOpen(false);
    }
  };

  return (
    <div className="w-full max-w mx-auto bg-white   rounded px-8 pt-6 pb-8 mb-4">
      <ToastContainer/>
      <h2 className="text-2xl font-bold mb-4">Return/Cancel Request</h2>

      <div className="space-y-4">{r}
        <div className="flex justify-between items-center ">
          <span className="font-semibold">Status:</span>
          <span className="capitalize">{status}</span>
        </div>

        {status.includes('requested') && (
          <div className="flex justify-end space-x-2">
            <button 
              onClick={() => handleAction('approve')}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
              Approve
            </button>
            <button 
              onClick={() => handleAction('reject')}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Reject
            </button>
          </div>
        )}
      </div>

      {isConfirmOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Confirm Action</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to {confirmAction.action} this {currentStatus.toLowerCase().includes('return') ? 'return' : 'cancel'} request?
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  id="ok-btn"
                  className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  onClick={confirmActionHandler}
                >
                  Confirm
                </button>
                <button
                  id="cancel-btn"
                  className="mt-3 px-4 py-2 bg-gray-300 text-black text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  onClick={() => setIsConfirmOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Userreturncancelmanager;
