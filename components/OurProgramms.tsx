import Image from 'next/image'
import React from 'react'
import cardio from "@/public/cardio.png"
import weightlifting from "@/public/lifting.png"
import bodybalancing from "@/public/balancing.png"
import  body from "@/public/body.png"
import yoga from "@/public/yoga.png"
import beginner from "@/public/beginner.png"

const OurProgramms = () => {
  return (
    <div className='min-h-screen grid sm:mt-10 mt-[5em] justify-center  lg:w-full  '>
        <div className='flex flex-col items-center'>
            <h2 className='text-orange-500 text-xl font-bold'>OUR SERVICES</h2>
            <h1 className='sm:text-4xl text-2xl font-bold'>TRAINING PROGRAMS</h1>
        </div>

        <div className='grid sm:grid-cols-3 lg:grid-cols-3 gap-10 mt-10'>

            <div className='flex flex-col sm:items-center items-start bg-gray-800  p-10 rounded-2xl' >
                <Image
                 src={cardio}
                 alt='cardio'
                 width={800}
                 height={800}
                 className='sm:h-[400px] sm:w-[500px] object-fill rounded-2xl cursor-pointer'
                />
                <h1 className='sm:text-3xl text-2xl mt-5 font-bold'>CARDIO STRENGTH</h1>
                <p className='mt-5 text-gray-400 flex '>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, quod. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis, neque. Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora, molestiae!</p>
            </div>

            <div className='flex flex-col sm:items-center items-start bg-gray-800  p-10 rounded-2xl' >
                <Image
                 src={weightlifting}
                 alt='cardio'
                 width={800}
                 height={800}
                 className='sm:h-[400px] sm:w-[500px] object-fill rounded-2xl cursor-pointer'
                />
                <h1 className='sm:text-3xl text-2xl mt-5 font-bold'>WEIGHT LIFTING</h1>
                <p className='mt-5 text-gray-400 flex '>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, quod. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis, neque. Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora, molestiae!</p>
            </div>

            <div className='flex flex-col sm:items-center items-start bg-gray-800  p-10 rounded-2xl' >
                <Image
                 src={bodybalancing}
                 alt='cardio'
                 width={800}
                 height={800}
                 className='sm:h-[400px] sm:w-[500px] object-fill rounded-2xl cursor-pointer'
                />
                <h1 className='sm:text-3xl text-2xl mt-5 font-bold'>BODY BALANCING</h1>
                <p className='mt-5 text-gray-400 flex '>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, quod. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis, neque. Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora, molestiae!</p>
            </div>

            <div className='flex flex-col sm:items-center items-start bg-gray-800  p-10 rounded-2xl' >
                <Image
                 src={body}
                 alt='cardio'
                 width={800}
                 height={800}
                 className='sm:h-[400px] sm:w-[500px] object-fill rounded-2xl cursor-pointer'
                />
                <h1 className='sm:text-3xl text-2xl mt-5 font-bold'>MUSCULE STRECHING</h1>
                <p className='mt-5 text-gray-400 flex '>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, quod. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis, neque. Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora, molestiae!</p>
            </div>

            <div className='flex flex-col sm:items-center items-start bg-gray-800  p-10 rounded-2xl' >
                <Image
                 src={yoga}
                 alt='cardio'
                 width={800}
                 height={800}
                 className='sm:h-[400px] sm:w-[500px] object-fill rounded-2xl cursor-pointer'
                />
                <h1 className='sm:text-3xl  text-2xl mt-5 font-bold'>BASIC YOGA</h1>
                <p className='mt-5 text-gray-400 flex '>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, quod. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis, neque. Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora, molestiae!</p>
            </div>

            <div className='flex flex-col sm:items-center items-start bg-gray-800  p-10 rounded-2xl' >
                <Image
                 src={beginner}
                 alt='cardio'
                 width={800}
                 height={800}
                 className='sm:h-[400px] sm:w-[500px] object-fill rounded-2xl cursor-pointer'
                />
                <h1 className='sm:text-3xl text-2xl mt-5 font-bold'>BEGINNER PILATES</h1>
                <p className='mt-5 text-gray-400 flex '>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, quod. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis, neque. Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora, molestiae!</p>
            </div>

          

        </div>

    </div>
  )
}

export default OurProgramms