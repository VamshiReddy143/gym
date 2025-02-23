import Image from 'next/image';
import React from 'react';
import couple from '@/public/hero.png';
import { SpinningText } from './magicui/spinning-text';
import muscle from '@/public/muscle.png';
import strength from '@/public/strength.png';
import flexibility from '@/public/flexibility.png';
import endurance from '@/public/endurance.png';

const WhyChooseUs = () => {
  return (
    <div className="sm:mt-10 mt-[5em] flex flex-col-reverse lg:flex-row items-center gap-10 sm:gap-[10em]  min-h-screen py-10">
      {/* Image Section */}
      <div className="relative flex items-center justify-center sm:mt-0 lg:mt-0 mt-[5em] sm:w-1/2">
        <Image
          src={couple}
          alt="hero"
          width={900}
          height={800}
          className="max-w-[100%] h-auto sm:h-[400px] sm:w-[600px] object-cover  rounded-full z-50"
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <SpinningText className="text-orange-500 text-6xl  sm:text-6xl lg:text-8xl">
            learn more • earn more • grow more •
          </SpinningText>
        </div>
      </div>

      {/* Features Section */}
      <div className="flex flex-col sm:items-start items-center   lg:w-1/2">
        <h2 className="text-lg sm:text-xl font-bold text-orange-500">OUR BEST FEATURES</h2>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-100 mt-4">
          WHY CHOOSE US?
        </h1>

        {/* Feature Cards */}
        <div className="grid grid-cols-2  sm:grid-cols-2 sm:gap-6 gap-10 mt-8">
          {/* Feature 1 */}
          <div className="flex flex-col  items-start gap-4">
            <div className="flex items-center justify-center w-[80px] sm:w-[100px] h-[80px] sm:h-[100px] p-4 bg-gray-800 rounded-2xl hover:rotate-6 cursor-pointer transition-all hover:scale-110">
              <Image src={muscle} alt="muscle" width={40} height={40} />
            </div>
            <div className="flex lg:w-[70%] flex-col">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-100">PROGRESSION</h1>
              <p className="text-sm sm:text-lg text-gray-500">
                Achieve new milestones with structured training.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-start gap-4">
            <div className="flex items-center justify-center w-[80px] sm:w-[100px] h-[80px] sm:h-[100px] p-4 bg-gray-800 rounded-2xl hover:rotate-6 cursor-pointer transition-all hover:scale-110">
              <Image src={strength} alt="strength" width={40} height={40} />
            </div>
            <div className="flex lg:w-[70%] flex-col">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-100">STRENGTH</h1>
              <p className="text-sm sm:text-lg text-gray-500">
                Build power and endurance effectively.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-start gap-4">
            <div className="flex items-center justify-center w-[80px] sm:w-[100px] h-[80px] sm:h-[100px] p-4 bg-gray-800 rounded-2xl hover:rotate-6 cursor-pointer transition-all hover:scale-110">
              <Image src={flexibility} alt="flexibility" width={40} height={40} />
            </div>
            <div className="flex lg:w-[70%] flex-col">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-100">FLEXIBILITY</h1>
              <p className="text-sm sm:text-lg text-gray-500">
                Improve mobility for better performance.
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="flex flex-col items-start gap-4">
            <div className="flex items-center justify-center w-[80px] sm:w-[100px] h-[80px] sm:h-[100px] p-4 bg-gray-800 rounded-2xl hover:rotate-6 cursor-pointer transition-all hover:scale-110">
              <Image src={endurance} alt="endurance" width={40} height={40} />
            </div>
            <div className="flex lg:w-[70%] flex-col">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-100">ENDURANCE</h1>
              <p className="text-sm sm:text-lg text-gray-500">
                Increase stamina for long-lasting energy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;