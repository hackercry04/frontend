import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import SERVERURL from '../Serverurl';
import { useNavigate } from 'react-router-dom';
function GoogleLoginComponent() {
const navigate=useNavigate()
  const handleSuccess = (credentialResponse) => {
    if (credentialResponse.credential) {
      // Store the token in local storage
      localStorage.setItem('google_token', credentialResponse.credential);
      console.log('Google login successful', credentialResponse);
      axios.post(`http://${SERVERURL}/user/google-login/`,{
       token:credentialResponse.credential

      }).then((res)=>{

        navigate('/user/home')
    localStorage.setItem('userAccessToken',res.data.access)
    localStorage.setItem('userRefreshToken',res.data.refresh)
    localStorage.setItem('username',res.data.first_name)
    window.location='/user/home/'
    
  })
      
      // Additional handling after successful login
    } else {
      console.log('No credential found in the response');
    }
  };

  const handleError = () => {
    console.log('Google login failed');
  };

  return (
    <div>
      <GoogleLogin
        onSuccess={handleSuccess}  // Directly pass the handleSuccess function
        onError={handleError}
      />
    </div>
  );
}

export default GoogleLoginComponent;
