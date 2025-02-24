"use client"

import Image from 'next/image';
import React from 'react';
import { motion } from "framer-motion";
import hero1 from "@/public/gymlogo1.jpg";

const Home = () => {
  return (
    <div className='sm:flex items-center   min-h-screen  mt-10  justify-between'>

      <div className='sm:flex sm:mb-[10em]  flex-col gap-2 sm:w-[70%]'>
        <motion.h2 
          initial={{ opacity: 0, y: -50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
          className='sm:text-4xl text-2xl text-orange-500 font-bold'
        >
          SINCE-1998
        </motion.h2>

       

       

        <motion.h1
          initial={{ opacity: 0, x: -100 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 1, delay: 0.3 }}
          className='sm:text-8xl text-4xl font-extrabold mt-5'
        >
          MAKE YOUR
        </motion.h1>

        <motion.h1
          initial={{ opacity: 0, x: 100 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 1, delay: 0.6 }}
          className='sm:text-8xl text-4xl font-extrabold'
        >
          BODY SHAPE
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className='sm:text-lg text-sm mt-7 text-gray-500 items-center w-[70%] sm:w-[70%]'
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, quia. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, aperiam.
        </motion.p>

       <div>
       <button className='bg-orange-500 text-sm font-bold text-white px-7 py-5 mt-10 rounded-full'>
          LEARN MORE
        </button>
       </div>
      </div>

      
     <div className=''>
   {/* <div className='sm:block hidden'>
   <motion.div 
        className='h-[100%] rotate-45 top-[100px] absolute right-[40%] bg-orange-500 text-orange-500'
       
        animate={{ rotate: 45 }}    
        transition={{ duration: 1.2 }}
      />
      <motion.div 
       
        animate={{ rotate: 45 }}
        transition={{ duration: 1.4 }}
        className='h-[100%]  rotate-45 top-[100px] absolute right-[50%] bg-orange-500'
      />
    
   </div> */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className='  sm:top-[100px] sm:right-[5%] '
      >
        <Image
          src={hero1}
          alt='hero'
          width={800}
          height={800}
          className="sm:h-[50em] sm:w-[50em] h-[30em] max-w-[100%] object-cover rounded-2xl cursor-pointer hover:scale-110 transition-all"
        />
      </motion.div>
     </div>

     

    </div>
  );
};

export default Home;


