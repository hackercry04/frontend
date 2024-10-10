import React from 'react'
import {jwtDecode} from "jwt-decode";

function UserAuth() {
    {

        const currentTime = Date.now() / 1000; // Current time in seconds
        
        const access=localStorage.getItem('userAccessToken')
        const refresh=localStorage.getItem('userRefreshToken')
        console.log('decoded')
    
    if (!access || !refresh){
    
        console.log('not authenticated')
        return false
    
    }
    const decoded = jwtDecode(access);
    
    if (decoded.role!=='user'){
    
        console.log('you are not a user ')
        return false
    
    }
    
    if( decoded.exp < currentTime){
       
        console.log('user token expired',decoded.exp-currentTime)
        return false
    }
    
    return true
    
    }
}

export default UserAuth