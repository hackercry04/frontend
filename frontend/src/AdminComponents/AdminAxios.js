import axios from 'axios';
import url from '../Serverurl'
import { useNavigate } from 'react-router-dom';
// Define an Axios instance
const axiosInstance = axios.create({
  baseURL: 'fsdfsdf', // replace with your API's base URL
  headers: {
    'Content-Type': 'application/json'
  }
});

// Function to get the access token from local storage
const getAccessToken = () => localStorage.getItem('adminaccesstoken');

// Function to get the refresh token from local storage
const getRefreshToken = () => localStorage.getItem('adminrefreshtoken');

// Function to save new tokens to local storage
const saveTokens = (accessToken) => {
  localStorage.setItem('adminaccesstoken', accessToken);
  
};

// Request interceptor to add JWT to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors and token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    return response; // Simply return the response if it's successful
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent endless retry loops

      try {
        const refreshToken = getRefreshToken();

        // Make a call to refresh the token
        const { data } = await axios.post(`http://${url}/api/token/refresh/`, {
          refresh: refreshToken
        });

        // Save the new tokens
        saveTokens(data.access, data.refresh);

        // Update the Authorization header with the new token
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;
        originalRequest.headers['Authorization'] = `Bearer ${data.access}`;

        // Retry the original request with the new token
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token error:', refreshError);
        window.location.href = '/admin/login?msg=401'; // Redirects to a new URL
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
