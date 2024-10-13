import React, { useEffect, useState } from 'react';
import axios from 'axios';
import logo from "../static/img/logo-removebg.png";
import SERVERURL from '../Serverurl';
function AdminLogin() {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const url=window.location.search;
  const params=new URLSearchParams(url)
  const msg=params.get('msg')
useEffect(()=>{
   msg==="401" && setError('ERROR:user not authenticated')
  

},[])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Replace this URL with your actual API endpoint
      const response = await axios.post(`https://${SERVERURL}/admin/api/token/`, {
        email,
        password,
        rememberMe
      }).then((res)=>{



      localStorage.setItem('adminaccesstoken',res.data.access)
      localStorage.setItem('adminrefreshtoken',res.data.refresh)
      window.location='/admin/home/dashboard/'

      });

      // Handle successful login
      console.log('Login successful', response.data);
      // TODO: Store the token, redirect to admin dashboard, etc.
      // For example:
      // localStorage.setItem('adminToken', response.data.token);

    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(error.response.data.message || 'Login failed. Please try again.');
      } else if (error.request) {
        // The request was made but no response was received
        setError('No response from server. Please try again later.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('An error occurred. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  

  return (

    <div>
      <nav className="text-white p-4" style={{ backgroundColor: "#FFA683", height: "140px" }}>
        <div className="container mx-auto flex justify-between items-center">
          <img src={logo} alt="Logo" style={{ width: "200px" }} />
        </div>
      </nav>
      
      <section className="bg-gray-50 dark:bg-gray-900">
        
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        {error && <p className="text-red-500 text-sm">{error}</p>}<br/>

          <div className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white p-4">
            <div style={{ color: '#602102', fontSize: '50px' }}>ADMIN Login</div>
          </div>
          
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
              </h1>
              
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Username"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between">
           
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminLogin;