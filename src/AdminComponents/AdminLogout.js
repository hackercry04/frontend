import React from 'react'

function AdminLogout() {
localStorage.removeItem('adminaccesstoken')
localStorage.removeItem('adminrefreshtoken')
window.location='/admin/login'
}

export default AdminLogout