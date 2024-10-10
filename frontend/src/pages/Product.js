import React from 'react'
import StickyNavbar from '../components/StickyNavbar'
import UserLogin from '../components/UserLogin'
import Footer from '../components/Footer'
import { ThemeProvider } from '@material-tailwind/react';
import ProductPage from './ProductPage';
import { useParams } from 'react-router-dom';
import UserLogout from '../components/UserLogout';

function Loginpage() {
  const p_id=useParams('p_id')

    return (
        <div className="app-container">
          <ThemeProvider>
            <StickyNavbar name={localStorage.getItem('username')} signout={<UserLogout/>}/>
    
            {/* Content area */}
            <div className="content">
              <ProductPage p_id={p_id}/>
            </div>
            <br/>
    
    
            {/* Footer will be pushed to the bottom */}
            <Footer className="footer" />
          </ThemeProvider>
        </div>
      );
}

export default Loginpage