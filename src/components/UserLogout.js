import React from 'react'

function UserLogout() {
    function out(){

        localStorage.removeItem('userAccessToken')
        localStorage.removeItem('userRefreshToken')
        window.location='/user/login'
    }
return(

<button onClick={()=>out()}>

    Logout
</button>

)
}

export default UserLogout