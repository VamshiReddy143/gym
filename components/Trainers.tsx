import Image from 'next/image'
import React from 'react'
import trainer from "@/public/trainer.jpg"
import trainer1 from "@/public/trainer3.jpg"
import trainer2 from "@/public/trainer2.jpg"

const Trainers = () => {
  return (
    <div className='min-h-screen w-full sm:mt-10 mt-[5em] flex flex-col items-center overflow-hidden'>
      
      {/* Heading Section */}
      <div className='text-center w-full px-4'>
        <h2 className='text-orange-500 text-xl font-bold'>TRAINERS</h2>
        <h1 className='text-4xl font-bold'>OUR EXPERT TRAINERS</h1>
      </div>

      {/* Trainers Section */}
      <div className='flex flex-wrap justify-center items-center gap-10 mt-10 w-full px-4'>
        
        {/* Trainer 1 */}
        <div className="relative w-full sm:w-auto">
          <Image
            src={trainer}
            alt='trainer'
            width={800}
            height={800}
            className='sm:h-[400px] sm:w-[300px] h-[300px] w-full object-cover rounded-2xl cursor-pointer hover:scale-110 transition-all'
          />
          <div className='bg-orange-500 absolute bottom-4 left-4 px-6 py-2 w-fit rounded-2xl rounded-br-[50px] cursor-pointer hover:px-[100px] transition-all'>
            <h1 className='font-bold text-xl'>JOHN</h1>
            <h3 className='font-bold text-lg'>Trainer</h3>         
          </div>
        </div>

        {/* Trainer 2 */}
        <div className="relative w-full sm:w-auto">
          <Image
            src={trainer2}
            alt='trainer'
            width={800}
            height={800}
            className='sm:h-[400px] sm:w-[300px] h-[300px] w-full object-cover rounded-2xl cursor-pointer hover:scale-110 transition-all'
          />
          <div className='bg-orange-500 absolute bottom-4 left-4 px-6 py-2 w-fit rounded-2xl rounded-br-[50px] cursor-pointer hover:px-[100px] transition-all'>
            <h1 className='font-bold text-xl'>ALBERT</h1>
            <h3 className='font-bold text-lg'>Trainer</h3>         
          </div>
        </div>

        {/* Trainer 3 */}
        <div className="relative w-full sm:w-auto">
          <Image
            src={trainer1}
            alt='trainer'
            width={800}
            height={800}
            className='sm:h-[400px] sm:w-[300px] h-[300px] w-full object-cover rounded-2xl cursor-pointer hover:scale-110 transition-all'
          />
          <div className='bg-orange-500 absolute bottom-4 left-4 px-6 py-2 w-fit rounded-2xl rounded-br-[50px] cursor-pointer hover:px-[100px] transition-all'>
            <h1 className='font-bold text-xl'>PUNK</h1>
            <h3 className='font-bold text-lg'>Trainer</h3>         
          </div>
        </div>

      </div>
    </div>
  )
}

export default Trainers
