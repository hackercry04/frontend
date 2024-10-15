import React, { useEffect, useState } from 'react'
import axiosInstance from '../components/UserAxios'
import SERVERURL from '../Serverurl'
import { ToastContainer,toast } from 'react-toastify'
import StickyNavbar from '../components/StickyNavbar'
import Footer from '../components/Footer'
import { useSearchParams } from 'react-router-dom';
import ManageAddressForCheckout from '../components/profile_components/ManageAdressForCheckout'
import Payment from '../Payment/Payment'
import Wallettopay from '../components/Wallettopay'
function Checkoutpageforsingleproduct() {
  const [couponCode, setCouponCode] = useState('');
  const [couponinfo,setCouponinfo]=useState([1]);
    const [searchParams] = useSearchParams();

    const quantity = searchParams.get('quantity');
    const productId = searchParams.get('product_id');
    const variantId = searchParams.get('varient_id');


    const [data,setData]=useState([])
    const [datatosend,setDatatoSend]=useState([0])
    const [originalprice,setOriginalprice]=useState(0)
    const [offer_price,setOfferprice]=useState(0)
    const [offershow,setOffershow]=useState(0)
    const [addrid,setAddressId]=useState(0)
    const [paymenttype,setPaymenttype]=useState('')

 


    useEffect(()=>{

      axiosInstance.post(`https://${SERVERURL}/user/order/checkout/`,{product_id:productId,variant_id:variantId,q:quantity}).then((res)=>{
         console.log(res.data.data)
         
  
          setData(res.data.data)
          setDatatoSend(res.data.data)


  
      }
      )


    },[])
 


const     handlecouponsubmit=()=>{

  
  axiosInstance.post(`https://${SERVERURL}/user/check/coupon/`,{

    code:couponCode
  }).then((res)=>{

      setCouponinfo(res.data.coupons)

  }).catch((e)=>{

    toast.error('coupon does not exist')
  })
}

    useEffect(() => {
      let price = 0;
      let offer=0 // Use let to allow mutation
    
      for (let i in datatosend) {
        let p = datatosend[i].product__price;
        let o= datatosend[i].product__offer_price;
    
        // Check if variant price exists, and use it if present
        if (datatosend[i].variant_id__price) {
          p = datatosend[i].variant_id__price;
        }
         
        if (datatosend[i].variant_id__offer_price){
          o=datatosend[i].variant__offer_price
        }
        // Calculate the price based on quantity
        price += parseInt(p) * (datatosend[i].quantity / 250);
        offer += parseInt(o) * (datatosend[i].quantity / 250);
      }
    
      setOriginalprice(price.toFixed(1))
      setOfferprice(offer.toFixed(1))
      setOffershow(offer-price)// Final price after the loop
    
    }, [datatosend]); // Add datatosend as a dependency if it's dynamic

const selectedAddress=(addrid)=>{

    setAddressId(addrid)
    console.log('this is the address id ',addrid)



}

if (addrid===0 || addrid==''||addrid===null){

  console.log(' no address preasnet')
}


const PlaceOrder=()=>{
    console.log('order placed')
if (addrid===0 || addrid==''){

  toast.error('please select an address')
  return 
}
axiosInstance.post(`https://${SERVERURL}/user/placeorder/`,{


    address_id:addrid,
    products:datatosend,
    coupon:couponCode,
    discountprice:couponinfo[0].discountValue,
    type:couponinfo[0].discountType,
    paymenttype:'cod'
}).then(()=>{

toast.success('order placed successfully')
window.location='/user/order/success'


})


}


   const  Stocksize=(item)=>{
      const [quantity,setQuantity]=useState(item.item.quantity)
      return (
        <>
        
        
        <ToastContainer/>
  <div className='font-bold'>
{quantity} (g)
    </div>      

                      <div class="text-end md:order-4 md:w-32">

               

                      <p class="line-through text-red-300 font-bold text-lg">
                    {((item.item.variant_id__price || item.item.product__price) / 250 * quantity).toFixed(2)}
                   
            
                  </p>
                  <p class="text-green-500 font-bold text-lg">
                    {((item.item.variant_id__offer_price || item.item.product__offer_price) / 250 * quantity).toFixed(2)}

                  </p>


                 
                </div>
        </>
      )
      }


  return (
    
    <div>
              <StickyNavbar/>

<section class="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
  <div class="mx-auto max-w-screen-xl px-4 2xl:px-0">
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">Checkout</h2>

    <div class="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
      <div class="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
        <div class="space-y-6">

{
    data.map((item,i)=>(    
      

          <div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
            
            {
              (item.product__quantity<250)||(item.variant_id__quantity && item.variant_id__quantity<250)&&
            <span class="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">Out of Stock</span>
}
            <div class="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
              <a href="#" class="w-20 shrink-0 md:order-1">
                <img class="h-20 w-20 dark:hidden" src={item.variant_id__image?`https://${SERVERURL}/media/`+item.variant_id__image:`https://${SERVERURL}/media/`+item.img} alt="imac image" />
              </a>
            
              <label for="counter-input" class="sr-only">Choose quantity:</label>
              
              <div class="flex items-center justify-between md:order-3 md:justify-end">
                
{/* product counter */}
               <Stocksize item={item} index={i}/>
               

            
              </div>

              <div class="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                <a href="#" class="text-base font-medium text-gray-900 hover:underline dark:text-white">{item.product__name} ({item.variant_id__name?item.variant_id__name:'standerd'})</a>
{/* 
                <div class="flex items-center gap-4">
                  <button type="button" class="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white">
                    <svg class="me-1.5 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z" />
                    </svg>
                    Add to Favorites
                  </button>

        
                </div> */}
              </div>
            </div>
   
          </div>
    ))
          }
        </div>
        <ManageAddressForCheckout passtheadress={selectedAddress}/>

     
      </div>

      <div class="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
        <div class="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
          <p class="text-xl font-semibold text-gray-900 dark:text-white">Order summary</p>

          <div class="space-y-4">
            <div class="space-y-2">
              <dl class="flex items-center justify-between gap-4">
                <dt class="text-base font-normal text-gray-500 dark:text-gray-400">Original price</dt>
                <dd class="text-base font-medium text-gray-900 dark:text-white">
                  
                  {parseInt(originalprice).toFixed(2)}
                  
                  </dd>
              </dl>

              <dl class="flex items-center justify-between gap-4">
                <dt class="text-base font-normal text-gray-500 dark:text-gray-400">Offer price</dt>
                <dd class="text-base font-medium text-blue-600">{parseInt(offer_price).toFixed(2)}</dd>
              </dl>
              {couponinfo[0] !== 1 &&
 ((datatosend[0].product__category === couponinfo[0].selectedCategory_id ||couponinfo[0].discountSection=='store' ) || 
  (parseInt(datatosend[0].product_id) === couponinfo[0].selectedProduct_id||couponinfo[0].discountSection=='store' )) && 
  couponinfo[0].discountValue && (
  <dl className="flex items-center justify-between gap-4">
    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Coupon</dt>
    <dd className="text-base font-medium text-blue-600">- {couponinfo[0].discountValue}</dd>
  </dl>
)}

              <dl class="flex items-center justify-between gap-4">
                <dt class="text-base font-normal text-gray-500 dark:text-gray-400">Savings</dt>
                <dd class="ttext-base font-medium text-green-600">{(offershow).toFixed(1)}</dd>
              </dl>

       
            </div>

            <dl class="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
              <dt class="text-base font-bold text-gray-900 dark:text-white">Total</dt>
              <dd class="text-base font-bold text-gray-900 dark:text-white">
              {
  couponinfo[0] !== 1 &&
  (
    (datatosend[0].product__category === couponinfo[0].selectedCategory_id ||couponinfo[0].discountSection=='store' ) || 
    (parseInt(datatosend[0].product_id) === couponinfo[0].selectedProduct_id||couponinfo[0].discountSection=='store' )
  )
    ? offer_price - (
        couponinfo[0].discountType === 'fixed' 
          ? couponinfo[0].discountValue 
          : (offer_price * couponinfo[0].discountValue / 100)
      )
    : offer_price
}

              </dd>
            </dl>
          </div>

          <a href="#" class="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" onClick={()=>{PlaceOrder();setPaymenttype('cod')}}>Place Order</a>
          <Payment 
  amount={
    couponinfo[0] !== 1 &&
    (
      (datatosend[0].product__category === couponinfo[0].selectedCategory_id||couponinfo[0].discountSection=='store' )|| 
      (parseInt(datatosend[0].product_id) === couponinfo[0].selectedProduct_id|| couponinfo[0].discountSection=='store')
    ) 
    ? offer_price - (
        couponinfo[0].discountType === 'fixed' 
        ? couponinfo[0].discountValue 
        : (offer_price * couponinfo[0].discountValue / 100)
      ) 
    : offer_price
  } 
  addrid={addrid} 
  datatosend={datatosend}
  couponCode={couponCode}
  
/>
<div class="hidden  xl:block">
        <Wallettopay  amount={offer_price-(couponinfo[0].discountValue?couponinfo[0].discountValue:0)} addrid={addrid} datatosend={datatosend} couponCode={couponCode} />
 
        </div>
        
          <div class="flex items-center justify-center gap-2">
            
            <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
               or </span>
            <a href="home/" title="" class="inline-flex items-center gap-2 text-sm font-medium text-primary-700 underline hover:no-underline dark:text-primary-500">
              Continue Shopping
              <svg class="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m14 0-4 4m4-4-4-4" />
              </svg>
            </a>
          </div>

          
        </div>


      <div class="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
          <form class="space-y-4">
            <div>
              <label for="voucher" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Do you have a voucher or gift card? </label>
              <input type="text" id="voucher" class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" placeholder="" required 
               onChange={(e) => setCouponCode(e.target.value)}
              />
            </div>
            <button type="button" class="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" onClick={handlecouponsubmit}>Apply Code</button>
          </form>
          {couponinfo[0]!==1&&

            <div class="text-green-500">
          code {couponinfo[0].code} applied: -{couponinfo[0].discountValue} {couponinfo[0].discountType === 'fixed' ? 'rs' : '%'} on specific {couponinfo[0].discountSection}          </div>
          }
        </div>
        {console.log(datatosend[0].product__category,couponinfo[0].selectedCategory_id,parseInt(datatosend.product_id),couponinfo[0].selectedProduct_id)}

      </div>

    </div>
  </div>
  
</section>  
<div className='bg-white py-20'/>
<Footer/>
    </div>
  )
}

export default Checkoutpageforsingleproduct