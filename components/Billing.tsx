"use client"

import React from 'react'

import { useUserId } from '@/app/hooks/useUserId';

const Billing = () => {

 
    const userId = useUserId()

    const plans = [
      { name: "Class Drop-in", price: 39, duration: 30 },
      { name: "12 Months Unlimited", price: 99, duration: 365 },
      { name: "6 Months Unlimited", price: 59, duration: 180 },
  ];

  const handleCheckout = async (plan: string, price: number, duration: number) => {
    if (!userId) return alert("Please log in first!");

    const response = await fetch("/api/checkout", {
        method: "POST",
        body: JSON.stringify({ userId, plan, price, duration }),
    });

    const data = await response.json();
    if (data.url) {
        window.location.href = data.url;
    } else {
        alert("Payment failed");
    }
};
  return (
    <div className='mb-[10em]'>
     <div className='flex flex-col items-center'>
     <h2 className='text-orange-500 text-xl font-bold'>OUR PLAN</h2>
     <h1 className='text-4xl font-bold'>CHOOSE YOUR PRICING PLAN</h1>
     </div>

     <div className='flex items-center justify-center  gap-10 mt-10  '>



   {plans.map((plan, index) => (
      <div key={index} className='flex flex-col items-center rounded-tl-[50px] rounded-br-[50px] border hover:bg-gray-100 transition-all duration-700 hover:text-black border-gray-600 py-10 px-20 w-fit'>
      <h1 className='text-2xl font-bold'>{plan.name}</h1>
      <h1 className='text-6xl font-extrabold text-orange-500 mt-4 '>${plan.price}</h1>
      <h2 className='text-xl font-bold mt-2'>{plan.duration} days</h2>
      <div className='flex flex-col items-center gap-2 mt-5'>
      <p>Free riding</p>
      <p>Unlimited equipment access</p>
      <p>Personal trainer</p>
      <p>Weight losing classes</p>
      <p>Month to Mouth</p>
      <p>No time restrictions</p>
      </div>

      <div>
      <button onClick={() => handleCheckout(plan.name, plan.price, plan.duration)}
      className='bg-orange-500 px-6 py-2 w-full font-bold text-white  mt-5'>JOIN NOW</button>
      </div>
  </div>
     ))}

      


     </div>
    </div>
  )
}

export default Billing