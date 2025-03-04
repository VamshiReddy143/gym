"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaWeight, FaRulerVertical, FaChartBar, FaHeartbeat, FaTint, FaExclamationTriangle } from "react-icons/fa";

const BMICalculatorPage = () => {
  const [height, setHeight] = useState<number | "">(170);
  const [weight, setWeight] = useState<number | "">(70);
  const [age, setAge] = useState<number | "">(30);
  const [gender, setGender] = useState<"male" | "female" | "">("male");
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState<string>("");
  const [healthRisk, setHealthRisk] = useState<string>("");
  const [idealWeight, setIdealWeight] = useState<string>("");
  const [waterIntake, setWaterIntake] = useState<string>("");
  const [heartRate, setHeartRate] = useState<string>("");

  const calculateBMI = () => {
    if (!height || !weight || !age || !gender) {
      alert("Please fill in all fields.");
      return;
    }
    const heightInMeters = height / 100;
    const bmiValue = Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
    setBmi(bmiValue);

    let cat = "", risk = "";
    if (bmiValue < 18.5) {
      cat = "Underweight";
      risk = "Low (Risk of nutritional deficiency)";
    } else if (bmiValue < 25) {
      cat = "Normal";
      risk = "Low (Healthy range)";
    } else if (bmiValue < 30) {
      cat = "Overweight";
      risk = "Moderate (Increased risk of cardiovascular issues)";
    } else {
      cat = "Obese";
      risk = "High (Risk of diabetes, heart disease)";
    }
    setCategory(cat);
    setHealthRisk(risk);

    const baseHeight = gender === "male" ? 50 : 45.5;
    const additionalWeight = 2.7 * ((height - 152.4) / 2.54);
    const idealMin = (baseHeight + additionalWeight * 0.9).toFixed(1);
    const idealMax = (baseHeight + additionalWeight * 1.1).toFixed(1);
    setIdealWeight(`${idealMin} - ${idealMax} kg`);

    const waterMin = (weight * 30 / 1000).toFixed(1);
    const waterMax = (weight * 35 / 1000).toFixed(1);
    setWaterIntake(`${waterMin} - ${waterMax} L/day`);

    const baseHR = gender === "male" ? 70 : 75;
    const hrAdjustment = age > 40 ? (age - 40) * 0.5 : 0;
    const hrMin = baseHR - 10 - hrAdjustment;
    const hrMax = baseHR + 10 - hrAdjustment;
    setHeartRate(`${hrMin.toFixed(0)} - ${hrMax.toFixed(0)} bpm`);
  };

  const resetForm = () => {
    setHeight(170);
    setWeight(70);
    setAge(30);
    setGender("male");
    setBmi(null);
    setCategory("");
    setHealthRisk("");
    setIdealWeight("");
    setWaterIntake("");
    setHeartRate("");
  };

  // Enhanced Variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 1, staggerChildren: 0.2 } },
  };

  const inputVariants = {
    idle: { scale: 1, boxShadow: "0 0 10px rgba(255,165,0,0.2)" },
    hover: { scale: 1.05, boxShadow: "0 0 20px rgba(255,165,0,0.6), 0 0 30px rgba(255,75,0,0.4)" },
    focus: { scale: 1.1, borderColor: "#f97316", boxShadow: "0 0 25px rgba(255,165,0,0.8)" },
  };

  const buttonVariants = {
    idle: { scale: 1, boxShadow: "0 0 15px rgba(255,165,0,0.3)" },
    hover: { scale: 1.15, boxShadow: "0 0 30px rgba(255,165ici,0,0.7), 0 0 50px rgba(255,75,0,0.5)" },
    tap: { scale: 0.95, boxShadow: "0 0 10px rgba(255,165,0,0.2)" },
  };

  const resultVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, type: "spring", bounce: 0.4 } },
  };

  const statVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, type: "spring", stiffness: 150 } },
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-8 py-16 overflow-hidden relative">
      {/* Mind-Blowing Background Effects */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,75,0,0.25),_transparent_60%)]"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(255,0,0,0.2),_transparent_70%)]"
        animate={{ rotate: 360, opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />
      <div className="absolute inset-0 bg-[url('/gym-texture.png')] opacity-15 pointer-events-none" />

      {/* Particle Effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-orange-500 rounded-full"
            initial={{ x: Math.random() * 100 + "%", y: Math.random() * 100 + "%" }}
            animate={{
              y: ["-10vh", "110vh"],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      <div className="max-w-5xl mx-auto relative z-20">
        {/* Epic Title */}
        <motion.h1
          initial={{ opacity: 0, y: -100, scale: 0.5 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, type: "spring", bounce: 0.5 }}
          className="text-5xl md:text-8xl font-extrabold text-center uppercase tracking-tight text-white mb-12 drop-shadow-[0_0_20px_rgba(255,165,0,0.8)]"
        >
          Unlock Your{" "}
          <motion.span
            animate={{ color: ["#f97316", "#ff4500", "#f97316"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-orange-500"
          >
            Vital Stats
          </motion.span>
        </motion.h1>

        {/* Input Form */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-gray-800/90 backdrop-blur-lg p-8 rounded-3xl shadow-[0_0_40px_rgba(255,165,0,0.4)] border-2 border-orange-600/30 overflow-hidden relative"
        >
          {/* Glowing Border Effect */}
          <motion.div
            className="absolute inset-0 border-4 border-transparent rounded-3xl pointer-events-none"
            animate={{
              borderColor: ["rgba(255,165,0,0)", "rgba(255,165,0,0.8)", "rgba(255,165,0,0)"],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div variants={inputVariants} whileHover="hover" whileFocus="focus">
              <label className="block text-sm font-bold text-gray-200 mb-2 flex items-center gap-3">
                <FaRulerVertical className="text-orange-500 animate-pulse" /> Height (cm)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value ? Number(e.target.value) : "")}
                className="w-full bg-gray-900/70 text-white p-4 rounded-xl border-2 border-orange-500/50 focus:outline-none focus:border-orange-600 transition-all duration-300 shadow-[0_0_15px_rgba(255,165,0,0.3)]"
                placeholder="170"
              />
            </motion.div>
            <motion.div variants={inputVariants} whileHover="hover" whileFocus="focus">
              <label className="block text-sm font-bold text-gray-200 mb-2 flex items-center gap-3">
                <FaWeight className="text-orange-500 animate-pulse" /> Weight (kg)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : "")}
                className="w-full bg-gray-900/70 text-white p-4 rounded-xl border-2 border-orange-500/50 focus:outline-none focus:border-orange-600 transition-all duration-300 shadow-[0_0_15px_rgba(255,165,0,0.3)]"
                placeholder="70"
              />
            </motion.div>
            <motion.div variants={inputVariants} whileHover="hover" whileFocus="focus">
              <label className="text-sm font-bold text-gray-200 mb-2 flex items-center gap-3">
                <FaChartBar className="text-orange-500 animate-pulse" /> Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value ? Number(e.target.value) : "")}
                className="w-full bg-gray-900/70 text-white p-4 rounded-xl border-2 border-orange-500/50 focus:outline-none focus:border-orange-600 transition-all duration-300 shadow-[0_0_15px_rgba(255,165,0,0.3)]"
                placeholder="30"
              />
            </motion.div>
            <motion.div variants={inputVariants} whileHover="hover" whileFocus="focus">
              <label className="text-sm font-bold text-gray-200 mb-2 flex items-center gap-3">
                <FaHeartbeat className="text-orange-500 animate-pulse" /> Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as "male" | "female")}
                className="w-full bg-gray-900/70 text-white p-4 rounded-xl border-2 border-orange-500/50 focus:outline-none focus:border-orange-600 transition-all duration-300 shadow-[0_0_15px_rgba(255,165,0,0.3)]"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </motion.div>
          </div>
          <div className="flex gap-6 mt-10 justify-center">
            <motion.button
              variants={buttonVariants}
              initial="idle"
              whileHover="hover"
              whileTap="tap"
              onClick={calculateBMI}
              className="px-12 py-5 bg-gradient-to-r from-orange-500 to-red-600 text-white text-xl font-bold rounded-full shadow-[0_0_25px_rgba(255,165,0,0.6)] hover:from-orange-600 hover:to-red-700 transition-all duration-500 relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
              Calculate
            </motion.button>
            <motion.button
              variants={buttonVariants}
              initial="idle"
              whileHover="hover"
              whileTap="tap"
              onClick={resetForm}
              className="px-12 py-5 bg-gradient-to-r from-gray-700 to-gray-800 text-white text-xl font-bold rounded-full shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:from-gray-600 hover:to-gray-700 transition-all duration-500 relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              Reset
            </motion.button>
          </div>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence>
          {bmi && (
            <motion.div
              variants={resultVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: 100, transition: { duration: 0.5 } }}
              className="bg-gray-800/90 backdrop-blur-lg p-8 rounded-3xl shadow-[0_0_40px_rgba(255,165,0,0.4)] border-2 border-orange-600/30 mt-12 relative overflow-hidden"
            >
              {/* Glowing Border */}
              <motion.div
                className="absolute inset-0 border-4 border-transparent rounded-3xl pointer-events-none"
                animate={{
                  borderColor: ["rgba(255,165,0,0)", "rgba(255,165,0,0.8)", "rgba(255,165,0,0)"],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <h2 className="text-4xl font-extrabold text-white mb-10 text-center tracking-wide drop-shadow-[0_0_15px_rgba(255,165,0,0.5)]">
                Your <span className="text-orange-500">Fitness Profile</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <motion.div
                  variants={statVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-center relative"
                >
                  <motion.div
                    className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <p className="text-sm font-bold text-gray-300 mb-2">BMI</p>
                  <motion.p
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: [0, 360] }}
                    transition={{ duration: 1, type: "spring", stiffness: 200 }}
                    className="text-6xl font-extrabold text-orange-500 drop-shadow-[0_0_10px_rgba(255,165,0,0.8)]"
                  >
                    {bmi}
                  </motion.p>
                  <p className="text-lg font-medium text-gray-200 mt-2">{category}</p>
                </motion.div>
                <motion.div
                  variants={statVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-center relative"
                >
                  <motion.div
                    className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <p className="text-sm font-bold text-gray-300 mb-2">Health Risk</p>
                  <p className="text-lg font-medium text-gray-200">{healthRisk}</p>
                  {bmi < 18.5 && (
                    <motion.p
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="text-sm text-red-500 mt-2 flex items-center justify-center gap-2"
                    >
                      <FaExclamationTriangle className="animate-bounce" /> Increase calorie intake (e.g., +500 cal/day)
                    </motion.p>
                  )}
                </motion.div>
                <motion.div
                  variants={statVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-center relative"
                >
                  <motion.div
                    className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <p className="text-sm font-bold text-gray-300 mb-2">Ideal Weight</p>
                  <p className="text-lg font-medium text-gray-200">{idealWeight}</p>
                </motion.div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
                <motion.div
                  variants={statVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-center relative"
                >
                  <motion.div
                    className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <p className="text-sm font-bold text-gray-300 mb-2 flex items-center justify-center gap-3">
                    <FaTint className="text-orange-500 animate-pulse" /> Water Intake
                  </p>
                  <motion.p
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="text-3xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,165,0,0.5)]"
                  >
                    {waterIntake}
                  </motion.p>
                </motion.div>
                <motion.div
                  variants={statVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-center relative"
                >
                  <motion.div
                    className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <p className="text-sm font-bold text-gray-300 mb-2 flex items-center justify-center gap-3">
                    <FaHeartbeat className="text-orange-500 animate-pulse" /> Resting Heart Rate
                  </p>
                  <motion.p
                    animate={{ scale: [1, 1.2, 1], color: ["#fff", "#f97316", "#fff"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="text-3xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,165,0,0.5)]"
                  >
                    {heartRate}
                  </motion.p>
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "100%" }}
                transition={{ duration: 1.5, delay: 0.8, type: "spring" }}
                className="mt-10 bg-gray-700 h-4 rounded-full overflow-hidden relative"
              >
                <motion.div
                  className="h-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((bmi - 15) / 25 * 100, 100)}%` }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  style={{
                    background: bmi < 18.5 ? "#ef4444" : bmi < 25 ? "#eab308" : bmi < 30 ? "#f97316" : "#dc2626",
                  }}
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
                className="text-center text-gray-300 text-sm mt-3 font-semibold"
              >
                {bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese"}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BMICalculatorPage;