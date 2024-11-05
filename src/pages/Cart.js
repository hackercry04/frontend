import React, { useEffect, useState } from 'react'
import axiosInstance from '../components/UserAxios'
import SERVERURL from '../Serverurl'
import { ToastContainer,toast } from 'react-toastify'
import StickyNavbar from '../components/StickyNavbar'
import Footer from '../components/Footer'
import Stepper from '../components/Stepper'
function Cart() {
    const [data,setData]=useState([0])
    const [datatosend,setDatatoSend]=useState([0])
    const [originalprice,setOriginalprice]=useState(0)
    const [offer_price,setOfferprice]=useState(0)
    const [offershow,setOffershow]=useState(0)
    const [couponCode, setCouponCode] = useState('');
    const [couponinfo,setCouponinfo]=useState([0]);
    const [discount,setDiscount]=useState(0);




 

    useEffect(()=>{

      axiosInstance.get(`https://${SERVERURL}/user/get/cart/`).then((res)=>{
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
      let offer=0 
      // Use let to allow mutation
    
      var  coupon_price=0
      for (let i in datatosend) {
        let p = datatosend[i].product__price;
        let o= datatosend[i].product__offer_price;
        console.log('these are te data',datatosend[i].product__category,couponinfo[0].selectedCategory_id,parseInt(datatosend[i].product_id),couponinfo[0].selectedProduct_id)

     
        
        
    
        // Check if variant price exists, and use it if present
        if (datatosend[i].variant_id__price) {
          p = datatosend[i].variant_id__price;
        }
         
        if (datatosend[i].variant_id__offer_price){
          o=datatosend[i].variant__offer_price
        }
        // Calculate the price based on quantity
        // coupon apllication and calculation of offerprice by filter ing products and categories 
        if (couponinfo[0] !== 1){
          if(datatosend[i].product__category === couponinfo[0].selectedCategory_id||parseInt(datatosend[0].product_id) === couponinfo[0].selectedProduct_id||couponinfo[0].discountSection=='store' ){
            
            if (couponinfo[0].discountType === 'fixed'){
              
              coupon_price=coupon_price+couponinfo[0].discountValue
              
            }
            else{
              
              coupon_price=coupon_price+((o*(datatosend[i].quantity/250))*(couponinfo[0].discountValue/100))
              

              console.log('this iss working',coupon_price)
            }


          }

        }
        
        //=======================================================================
        price += parseInt(p) * (datatosend[i].quantity / 250);
        offer += (parseInt(o) * (datatosend[i].quantity / 250));

      }
      setDiscount(coupon_price)


      setOriginalprice(price.toFixed(1))
      setOfferprice(offer.toFixed(1))
      setOffershow(offer-price)// Final price after the loop
    
    }, [datatosend,couponinfo]); // Add datatosend as a dependency if it's dynamic


const calc=()=>{

  let price = 0;
  let offer=0 // Use let to allow mutation

  for (let i in datatosend) {
    let p = datatosend[i].product__price;
    let o= datatosend[i].product__offer_price;
    console.log(datatosend[i]);

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

  setOriginalprice(price)
  setOfferprice(offer)
  setOffershow(offer-price)
}



    const removeproduct=(item,i)=>{
      let newdata =[...data]
      let datatosendtocart=[...datatosend]

      axiosInstance.post(`https://${SERVERURL}/user/cart/remove/`,{
        item
      }).then((res)=>{


        datatosendtocart.splice(i,1)
        newdata.splice(i,1)
        setData(newdata)
        setDatatoSend(datatosendtocart)
        
      })
    }




   const  Stocksize=(item)=>{

    const updatedatatosend=(index,quantity)=>{
      
      let newdata=datatosend
      newdata[index].quantity=quantity
     
      setDatatoSend(newdata)
      calc()


    }
  
      const [quantity,setQuantity]=useState(item.item.quantity)
      const handlechange=(e,price,offer)=>{
            if (e.target.value>5000){
            
              setQuantity(250)
              updatedatatosend(item.index,250)
              toast.error("maximum limit exceeded")
              return 
            }
         
        
        setQuantity(e.target.value)
        updatedatatosend(item.index,e.target.value)
        console.log(price)

            
      }


      const addQuantity=(item)=>{

        if (parseInt(quantity)+50>5000){
          toast.error('limit exceeded')
          return 0
        }
        setQuantity(parseInt(quantity)+50)
        console.log(item.item.product__price)

        updatedatatosend(item.index,parseInt(quantity)+50)
        Updatecart(item)

     

        

      }
      const subQuantity=(item)=>{
        if (quantity-50<250){
          toast.error('limit exceeded')
          return 0
        }
        updatedatatosend(item.index,parseInt(quantity)- 50)
        setQuantity(parseInt(quantity)-50)
        Updatecart(item)

      
      }
      const Updatecart=(item)=>{

   console.log(item)

   axiosInstance.post(`https://${SERVERURL}/user/update/cart/`,{

    item:item.item
   }).then((res)=>{


    console.log('success')
   })

      }


      return (
        <>
     
        
        
        <ToastContainer/>
                      <div class="flex items-center">
                        <button type="button" id="decrement-button-5" data-input-counter-decrement="counter-input-5" class="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700" onClick={()=>{subQuantity(item)}}>
                                 
                          <svg class="h-2.5 w-2.5 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h16" />
                          </svg>
                        </button>
                        <input
  type="text"
  id="counter-input-5"
  data-input-counter
  className="w-14 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0 dark:text-white"
  placeholder=""
  value={quantity}
  required
  onChange={(e) => handlechange(
    e,  // Pass the event first
    ((item.item.variant_id__price || item.item.product__price) / 250 * (quantity)).toFixed(1),  // First calculated value
    ((item.item.variant_id__offer_price || item.item.product__offer_price) / 250 * (quantity)).toFixed(1)  // Second calculated value
  )}
  disabled='true'
/>

                        <button type="button" id="increment-button-5" data-input-counter-increment="counter-input-5" class="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700" onClick={()=>{
                          
                          addQuantity(item)}}>
                          <svg class="h-2.5 w-2.5 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16" />
                          </svg>
                        </button>
                      </div>
                      <div class="text-end md:order-4 md:w-32">

               

                      <p class="line-through text-red-300 font-bold text-lg">
                    {((item.item.variant_id__price || item.item.product__price) / 250 * quantity).toFixed(1)}
                   
            
                  </p>
                  <p class="text-green-500 font-bold text-lg">
                    {((item.item.variant_id__offer_price || item.item.product__offer_price) / 250 * quantity).toFixed(1)}

                  </p>


                 
                </div>
        </>
      )
      }

  return (
    
    
    <div>

              <StickyNavbar/>

              
{datatosend[0]?(<>
  <section class="bg-white py-[150px] antialiased dark:bg-gray-900 md:py-16">
  <Stepper currentStep={0} className="sm:py-100 my-4 sm:my-0 " />

<div class="mx-auto max-w-screen-xl px-2 sm:px-4 2xl:px-0 py-6 sm:py-4 py-4">
  <h2 class="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl hidden sm:block">Shopping Cart</h2>

    <div class="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
      <div class="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
        <div class="space-y-6">

{
    data.map((item,i)=>(    
      

          <div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
            
            {
  ((!item.variant_id__quantity && item.product__quantity < 250) || 
  (item.variant_id__quantity && item.variant_id__quantity < 250)) && (
    removeproduct(item,i)
  )
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

                <div class="flex items-center gap-4">
                  {/* <button type="button" class="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white">
                    <svg class="me-1.5 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z" />
                    </svg>
                    Add to Favorites
                  </button> */}

                  <button type="button" class="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500" onClick={()=>removeproduct(item,i)}>
                    <svg class="me-1.5 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6" />
                    </svg>
                    Remove
                  </button>
                </div>
              </div>
            </div>
   
          </div>
    ))
          }
        </div>
        <div class="hidden xl:mt-8 xl:block">
 
        </div>
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

              {
              discount!==0&&(

                <dl class="flex items-center justify-between gap-4">
                <dt class="text-base font-normal text-gray-500 dark:text-gray-400">Coupon</dt>
                <dd class="text-base font-medium text-blue-600">-{(discount)}</dd>
              </dl>
  )

              }

              <dl class="flex items-center justify-between gap-4">
                <dt class="text-base font-normal text-gray-500 dark:text-gray-400">Savings</dt>
                <dd class="ttext-base font-medium text-green-600">{(offershow).toFixed(1)}</dd>
              </dl>

       
            </div>

            <dl class="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
              <dt class="text-base font-bold text-gray-900 dark:text-white">Total</dt>
              <dd class="text-base font-bold text-gray-900 dark:text-white">{parseInt((discount!==0?(offer_price)-discount:(offer_price))).toFixed(2)}</dd>
            </dl>
          </div>

          <a href={`checkout?code=${couponCode}&discount=${discount}&type=${couponinfo[0].discountType}`} class="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" >Proceed to Checkout</a>

          <div class="flex items-center justify-center gap-2">
            <span class="text-sm font-normal text-gray-500 dark:text-gray-400"> or </span>
            <a href="#" title="" class="inline-flex items-center gap-2 text-sm font-medium text-primary-700 underline hover:no-underline dark:text-primary-500">
              Continue Shopping
              {console.log(discount)}
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
</>):<div class="min-h-screen flex justify-center items-center bg-gray-100">
  <h1 class="text-3xl font-bold text-orange-700">NOTHING TO SHOW</h1>
</div>



}
<div className='bg-white py-20'/>
<Footer/>

    </div>
  )
}

export default Cart