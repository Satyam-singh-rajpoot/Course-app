import axios from 'axios'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import {  useNavigate, useParams } from 'react-router-dom'
import { BACKEND_URL } from '../utils/utils'


const Buy = () => {

  const {courseId}= useParams()
  const [loading , setLoading] = useState(false)

  const navigate = useNavigate()

  const user=JSON.parse(localStorage.getItem("user"))
  const token=user
  

  const handlePurchase=async()=>{
    if(!token){
      
      toast.error("Please login to purchase the courses")
      return
    }
    try {
      setLoading(true)
      const {data}= await axios.post(`${BACKEND_URL}/api/v1/course/buy/${courseId}`,{},{
        withCredentials:true,
        
      })
      
      toast.success(data.message || "Course purchases successfully!")
      
      navigate("/purchases")
      setLoading(false)
    } catch (error) {
      
      setLoading(false)
      if(error?.response?.status===400){
        toast.error(error.response.data.message || "You have already purchased this courses")
         navigate("/purchases")
      }else{
        console.log(error.response)
        toast.error(error?.response?.data?.message)
      }
    }
  };

  return (
    <div className='flex h-screen items-center justify-center'>
      <button className='bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-800 duration-300'
      onClick={handlePurchase}
      disabled={loading}
      >
        {loading?"Processing..." : "Buy Now"}
      </button>
    </div>
  )
}

export default Buy
