'use client';
import { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeartbeat, FaTint, FaWeight, FaFire } from 'react-icons/fa';

const BMICalculator = () => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [bmi, setBMI] = useState<number | null>(null);
  const [bmr, setBMR] = useState<number | null>(null);
  const [bodyFat, setBodyFat] = useState<number | null>(null);
  const [waterIntake, setWaterIntake] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const heartRate = 72;

  const calculate = () => {
    if (!height || !weight || !age) return;
    setIsLoading(true);
    setTimeout(() => {
      const heightMeters = (parseFloat(height) * 0.3048).toFixed(2);
      const bmiValue = (parseFloat(weight) / (parseFloat(heightMeters) ** 2)).toFixed(1);
      const bmrValue = (10 * parseFloat(weight) + 6.25 * parseFloat(height) * 30.48 - 5 * parseFloat(age) + 5).toFixed(1);
      const bodyFatValue = ((1.20 * parseFloat(bmiValue)) + (0.23 * parseFloat(age)) - 16.2).toFixed(1);
      const waterValue = (parseFloat(weight) * 0.035).toFixed(1);
      setBMI(parseFloat(bmiValue));
      setBMR(parseFloat(bmrValue));
      setBodyFat(parseFloat(bodyFatValue));
      setWaterIntake(parseFloat(waterValue));
      setIsLoading(false);
    }, 1000); // Simulate a smooth 1-second loading delay
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white px-4 py-8">
      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="w-16 h-16"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            >
              <CircularProgressbar
                value={100}
                styles={buildStyles({
                  pathColor: '#4F46E5',
                  trailColor: 'transparent',
                  strokeWidth: 10,
                })}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Section */}
      <motion.div
        className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-700"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <h1 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          BMI & Health Tracker
        </h1>
        <div className="space-y-4">
          <input
            type="number"
            placeholder="Height (feet)"
            className="w-full p-4 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 placeholder-gray-400"
            onChange={(e) => setHeight(e.target.value)}
          />
          <input
            type="number"
            placeholder="Weight (kg)"
            className="w-full p-4 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 placeholder-gray-400"
            onChange={(e) => setWeight(e.target.value)}
          />
          <input
            type="number"
            placeholder="Age"
            className="w-full p-4 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 placeholder-gray-400"
            onChange={(e) => setAge(e.target.value)}
          />
          <motion.button
            className="w-full p-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg transition-all duration-300 font-semibold text-white"
            onClick={calculate}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Calculate
          </motion.button>
        </div>
      </motion.div>

      {/* Results Section */}
      <AnimatePresence>
        {bmi !== null && !isLoading && (
          <motion.div
            className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {[
              { label: 'BMI', value: bmi, icon: <FaWeight /> },
              { label: 'BMR', value: bmr, icon: <FaFire /> },
              { label: 'Body Fat %', value: bodyFat, icon: <FaTint /> },
              { label: 'Water Intake (L)', value: waterIntake, icon: <FaTint /> },
              { label: 'Heart Rate (BPM)', value: heartRate, icon: <FaHeartbeat /> },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center p-6 bg-gray-700 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-4xl text-blue-400 mb-4">{item.icon}</div>
                <div className="w-32 h-32">
                  <CircularProgressbar
                    value={item.value ?? 0}
                    text={`${item.value?.toFixed(1) || '0'}`}
                    styles={buildStyles({
                      textColor: '#fff',
                      pathColor: '#4F46E5',
                      trailColor: '#374151',
                      textSize: '20px',
                      strokeWidth: 8,
                    })}
                  />
                </div>
                <p className="text-center mt-4 text-lg font-medium text-gray-200">{item.label}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BMICalculator;