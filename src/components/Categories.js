import React, { useEffect, useState } from 'react';
import dates from '../static/img/pexels-shkrabaanthony-4499229.jpg'
import axiosInstance from './UserAxios';
import SERVERURL from '../Serverurl';
// Image imports or URLs (replace with your actual image paths)
function Categories() {
  const [categories,setCategories]=useState([])

useEffect(()=>{
axiosInstance.get(`http://${SERVERURL}/user/categories/all/`).then(
  (res)=>{
    setCategories(res.data.categories)
  }
)
  


},[])




  return (
    <div className="flex justify-center items-center space-x-6 p-8 bg-gray-100">
      
      {categories.map((category, index) => (
        <div key={category.category_id} className="flex flex-col items-center" >

          <span className="text-center  text-gray-700 text-xl text-decoration-line: underline;" hidden={!category.listed} >
            <button>

            {category.name}
            
            </button>
          </span>
        </div>
      ))}
    </div>
  );
}

export default Categories;
