import React from 'react'
import {jwtDecode} from "jwt-decode";
function AdminAuth() {

    const currentTime = Date.now() / 1000; // Current time in seconds
    
    const access=localStorage.getItem('adminaccesstoken')
    const refresh=localStorage.getItem('adminrefreshtoken')
    console.log('decoded')

if (!access || !refresh){

    console.log('not authenticated')
    return false

}
const decoded = jwtDecode(access);

if (decoded.role!=='admin'){

    console.log('you are not the admin ')
    return false

}

if( decoded.exp < currentTime){
   
    console.log('token expired')
    return false
}

return true

}

export default AdminAuth