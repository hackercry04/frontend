import React from 'react'
import  axiosInstance from '../components/UserAxios'
import SERVERURL from '../Serverurl'
import { toast, ToastContainer } from 'react-toastify'
function AddtoWishlist(props) {

const addproducttowishllist=()=>{
axiosInstance.post(`https://${SERVERURL}/user/addto/wishlist/`,{

product_id:props.product_id,
product_varient_id:props.varient_id,
imageurl:props.image


}).then((res)=>{
  console.log(res.data)
  toast.success(res.data)
})


}


  return (
    <div>
<ToastContainer/>
<button onClick={addproducttowishllist}>add</button>

    </div>
  )
}

export default AddtoWishlist