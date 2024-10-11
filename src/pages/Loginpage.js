import React from 'react'
import StickyNavbar from '../components/StickyNavbar'
import UserLogin from '../components/UserLogin'
import Footer from '../components/Footer'
import { ThemeProvider } from '@material-tailwind/react';
import GoogleLoginComponent from '../components/Google_login';
import { ToastContainer,toast } from 'react-toastify';
function Loginpage() {


    return (
        <div className="app-container">
          <ToastContainer/>
          <ThemeProvider>
            <StickyNavbar />
    
            {/* Content area */}
            <div className="content">
          {/* <GoogleLoginComponent/> */}
              
              <UserLogin/>
            </div>
    
    
            {/* Footer will be pushed to the bottom */}
            <Footer className="footer" />
          </ThemeProvider>
        </div>
      );
}

export default Loginpage