  import React, { useEffect, useState } from 'react';
  import axiosInstance from './AdminAxios';
  import { toast, ToastContainer } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
  import url from '../Serverurl';
  import { ConfirmDialog } from 'primereact/confirmdialog'; // To use <ConfirmDialog> tag
  import { confirmDialog } from 'primereact/confirmdialog'; // To use confirmDialog method
  function CategoryTable() {


   







    const [categories, setCategories] = useState([]);
    const [editingCategory, setEditingCategory] = useState(null);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryListed, setNewCategoryListed] = useState(false);
    const [change, setChange] = useState(false);

    useEffect(() => {
      fetchCategories();
    }, [change]);

    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get(`https://${url}/admin/get_categories/`);
        setCategories(response.data.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Error fetching categories. Please try again.');
      }
    };

    const handleAddCategory = async (e) => {
      e.preventDefault();
      try {
        await axiosInstance.post(`https://${url}/admin/addnewcategory/`, {
          name: newCategoryName,
          listed: newCategoryListed,
        });
        toast.success('Category added successfully!');
        setChange(!change);
        setNewCategoryName('');
        setNewCategoryListed(false);
      } catch (error) {
        console.error('Error adding category:', error);
        toast.error('Error adding category. Please try again.');
      }
    };

    const handleEditClick = (category) => {
      setEditingCategory({ ...category });
    };

    const handleEditSave = async () => {
      try {
        await axiosInstance.put(`https://${url}/admin/edit_category/${editingCategory.category_id}/`, {
          name: editingCategory.name,
          listed: editingCategory.listed,
        });
        toast.success('Category updated successfully!');
        setChange(!change);
        setEditingCategory(null);
      } catch (error) {
        console.error('Error updating category:', error);
        toast.error('Error updating category. Please try again.');
      }
    };

    const handleDeleteCategory = async (id) => {
      try {
        await axiosInstance.delete(`https://${url}/admin/delete_category/${id}/`);
        toast.success('Category deleted successfully!');
        setChange(!change);
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error('Error deleting category. Please try again.');
      }
    };

    return (
      <div className="container mx-auto p-4">
        <ToastContainer />
        
        {/* Category Table */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Categories</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.category_id}>
                    <td className="px-6 py-4 whitespace-nowrap">{category.category_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingCategory && editingCategory.category_id === category.category_id ? (
                        <input
                          type="text"
                          value={editingCategory.name}
                          onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                          className="border rounded px-2 py-1"
                        />
                      ) : (
                        category.name
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingCategory && editingCategory.category_id === category.category_id ? (
                        <input
                          type="checkbox"
                          checked={editingCategory.listed}
                          onChange={(e) => setEditingCategory({ ...editingCategory, listed: e.target.checked })}
                        />
                      ) : (
                        category.listed ? 'Listed' : 'Unlisted'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingCategory && editingCategory.category_id === category.category_id ? (
                        <>
                          <button onClick={handleEditSave} className="text-green-600 hover:text-green-900 mr-2">Save</button>
                          <button onClick={() => setEditingCategory(null)} className="text-gray-600 hover:text-gray-900">Cancel</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleEditClick(category)} className="text-blue-600 hover:text-blue-900 mr-2">Edit</button>
                          <button onClick={() => handleDeleteCategory(category.category_id)} className="text-red-600 hover:text-red-900">Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add New Category Form */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Add New Category</h2>
          <form onSubmit={handleAddCategory} className="max-w-sm">
            <div className="mb-4">
              <label htmlFor="newCategoryName" className="block text-sm font-medium text-gray-700">Category Name</label>
              <input
                type="text"
                id="newCategoryName"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={newCategoryListed}
                  onChange={(e) => setNewCategoryListed(e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-600">Listed</span>
              </label>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add Category
            </button>
          </form>
        </div>
      </div>
    );
  }

  export default CategoryTable;