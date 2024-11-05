import React, { useEffect, useState } from 'react';
import axiosInstance from './UserAxios';
import SERVERURL from '../Serverurl';

function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axiosInstance.get(`https://${SERVERURL}/user/categories/all/`).then((res) => {
      setCategories(res.data.categories);
    });
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 bg-gray-100">
      {categories.map((category) => (
        <div key={category.category_id} className="flex flex-col items-center">
          <span className="text-center text-gray-700 text-lg" hidden={!category.listed}>
            <button className="hover:underline focus:outline-none">
              {category.name}
            </button>
          </span>
        </div>
      ))}
    </div>
  );
}

export default Categories;
