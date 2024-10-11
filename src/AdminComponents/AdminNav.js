import React from 'react'
import logo from '../static/img/logo-removebg.png' 
function AdminNav() {
  return (
    <div>
        <nav className=" text-white p-4" style={{ backgroundColor: "#FFA683",height:"140px" }}>
  <div className="container mx-auto flex justify-between items-center">
    <img 
      src={logo} 
     style={{width:"200px"}}

    />
    <div className="flex space-x-4">
      <a href="#" className="hover:text-gray-200">Home</a>
      <a href="#" className="hover:text-gray-200">About</a>
      <a href="#" className="hover:text-gray-200">Services</a>
      <a href="#" className="hover:text-gray-200">Contact</a>
    </div>
  </div>
</nav>
    </div>
  )
}

export default AdminNav