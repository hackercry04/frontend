import React, { useEffect, useState } from 'react';
import axiosInstance from '../AdminComponents/AdminAxios';
import SERVERURL from '../Serverurl';
import { FaUser } from 'react-icons/fa';

function Users() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [tempStatus, setTempStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  useEffect(() => {
    axiosInstance.get(`https://${SERVERURL}/admin/getallusers/`).then((res) => {
      setUsers(res.data.users);
    });
  }, []);

  const handleEditClick = (user) => {
    setEditingUser(user.id);
    setTempStatus(user.status);
  };

  const handleCancelClick = () => {
    setEditingUser(null);
    setTempStatus('');
  };

  const handleStatusToggle = () => {
    setTempStatus((prevStatus) => (prevStatus === 'active' ? 'inactive' : 'active'));
  };

  const handleSaveClick = (userId) => {
    axiosInstance
      .post(`https://${SERVERURL}/admin/updatestatus/`, {
        userId: userId,
        status: tempStatus,
      })
      .then((res) => {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, status: tempStatus } : user
          )
        );
        setEditingUser(null);
        setTempStatus('');
      })
      .catch((err) => {
        console.error('Error updating status:', err);
      });
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearchQuery =
      user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' || user.status === filterStatus;

    return matchesSearchQuery && matchesStatus;
  });

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className="pb-4 bg-white dark:bg-gray-900 flex justify-between items-center">
          <div>
            <label htmlFor="table-search" className="sr-only">
              Search
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="table-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search for items"
              />
            </div>
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="block text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="p-4">
                <div className="flex items-center"></div>
              </th>
              <th scope="col" className="px-6 py-3">
                Id
              </th>
              <th scope="col" className="px-6 py-3">
                User
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Phone
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((data) => (
              <tr
                key={data.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="w-4 p-4">
                  <div className="flex items-center">1</div>
                </td>
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <FaUser size={40} color="black" />
                </th>
                <td className="px-6 py-4">{data.id}</td>
                <td className="px-6 py-4">{data.first_name}</td>
                <td className="px-6 py-4">{data.email}</td>
                <td className="px-6 py-4">{data.phone || 'null'}</td>
                <td className="px-6 py-4">
                  {editingUser === data.id ? (
                    <button onClick={handleStatusToggle} className={`font-medium text-${tempStatus==='active'?'green':'red'}-600 hover:underline`}>                      
                     {tempStatus}
                    </button>
                  ) : (
                    <span style={{ color: `${data.status === 'active' ? 'green' : 'red'}` }}>
                      {data.status}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingUser === data.id ? (
                    <>
                      <button
                        onClick={() => handleSaveClick(data.id)}
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline me-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelClick}
                        className="font-medium text-red-600 dark:text-red-500 hover:underline"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleEditClick(data)}
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center mt-4">
          {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }, (_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`px-3 py-1 mx-1 rounded ${
                currentPage === i + 1
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Users;