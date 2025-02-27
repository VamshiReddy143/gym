"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
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

        // BMI Category and Health Risk
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

        // Ideal Weight (Devine Formula)
        const baseHeight = gender === "male" ? 50 : 45.5;
        const additionalWeight = 2.7 * ((height - 152.4) / 2.54);
        const idealMin = (baseHeight + additionalWeight * 0.9).toFixed(1);
        const idealMax = (baseHeight + additionalWeight * 1.1).toFixed(1);
        setIdealWeight(`${idealMin} - ${idealMax} kg`);

        // Water Intake (based on weight: 30-35ml per kg)
        const waterMin = (weight * 30 / 1000).toFixed(1);
        const waterMax = (weight * 35 / 1000).toFixed(1);
        setWaterIntake(`${waterMin} - ${waterMax} L/day`);

        // Resting Heart Rate (approximation based on age and gender)
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

    const inputVariants = {
        hover: { scale: 1.02, boxShadow: "0 0 15px rgba(255,165,0,0.3)" },
        focus: { scale: 1.05, borderColor: "#f97316", boxShadow: "0 0 20px rgba(255,165,0,0.5)" },
    };

    const buttonVariants = {
        hover: { scale: 1.05, boxShadow: "0 0 25px rgba(255,165,0,0.5)" },
        tap: { scale: 0.95 },
    };

    const resultVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white px-8 py-16 overflow-hidden relative">
            {/* Futuristic Background */}
            <motion.div
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,75,0,0.15),_transparent_70%)]"
                animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.6, 0.4] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="absolute inset-0 bg-[url('/gym-texture.png')] opacity-10 pointer-events-none" />

            <div className="max-w-5xl mx-auto relative z-20">
                <motion.h1
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="text-5xl md:text-7xl font-extrabold text-center uppercase tracking-tight text-white mb-12 drop-shadow-[0_0_15px_rgba(255,165,0,0.5)]"
                >
                    Unlock Your <span className="text-orange-500">Vital Stats</span>
                </motion.h1>

                {/* Input Form */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="bg-gray-800/80 backdrop-blur-md p-8 rounded-2xl shadow-[0_0_30px_rgba(255,165,0,0.2)] border border-gray-700/50"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div variants={inputVariants} whileHover="hover" whileFocus="focus">
                            <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                                <FaRulerVertical className="text-orange-500" /> Height (cm)
                            </label>
                            <input
                                type="number"
                                value={height}
                                onChange={(e) => setHeight(e.target.value ? Number(e.target.value) : "")}
                                className="w-full bg-gray-900/50 text-white p-4 rounded-xl border border-gray-600 focus:outline-none focus:border-orange-500 transition-all duration-300 shadow-inner"
                                placeholder="170"
                            />
                        </motion.div>
                        <motion.div variants={inputVariants} whileHover="hover" whileFocus="focus">
                            <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                                <FaWeight className="text-orange-500" /> Weight (kg)
                            </label>
                            <input
                                type="number"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : "")}
                                className="w-full bg-gray-900/50 text-white p-4 rounded-xl border border-gray-600 focus:outline-none focus:border-orange-500 transition-all duration-300 shadow-inner"
                                placeholder="70"
                            />
                        </motion.div>
                        <motion.div variants={inputVariants} whileHover="hover" whileFocus="focus">
                            <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                                <FaChartBar className="text-orange-500" /> Age
                            </label>
                            <input
                                type="number"
                                value={age}
                                onChange={(e) => setAge(e.target.value ? Number(e.target.value) : "")}
                                className="w-full bg-gray-900/50 text-white p-4 rounded-xl border border-gray-600 focus:outline-none focus:border-orange-500 transition-all duration-300 shadow-inner"
                                placeholder="30"
                            />
                        </motion.div>
                        <motion.div variants={inputVariants} whileHover="hover" whileFocus="focus">
                            <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                                <FaHeartbeat className="text-orange-500" /> Gender
                            </label>
                            <select
                                value={gender}
                                onChange={(e) => setGender(e.target.value as "male" | "female")}
                                className="w-full bg-gray-900/50 text-white p-4 rounded-xl border border-gray-600 focus:outline-none focus:border-orange-500 transition-all duration-300 shadow-inner"
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </motion.div>
                    </div>
                    <div className="flex gap-6 mt-8 justify-center">
                        <motion.button
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            onClick={calculateBMI}
                            className="px-10 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-lg font-semibold rounded-full shadow-[0_0_20px_rgba(255,165,0,0.4)] hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
                        >
                            Calculate
                        </motion.button>
                        <motion.button
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            onClick={resetForm}
                            className="px-10 py-4 bg-gray-700 text-white text-lg font-semibold rounded-full shadow-[0_0_10px_rgba(255,255,255,0.1)] hover:bg-gray-600 transition-all duration-300"
                        >
                            Reset
                        </motion.button>
                    </div>
                </motion.div>

                {/* Results Section */}
                {bmi && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={resultVariants}
                        className="bg-gray-800/80 backdrop-blur-md p-8 rounded-2xl shadow-[0_0_30px_rgba(255,165,0,0.2)] border border-gray-700/50 mt-12"
                    >
                        <h2 className="text-3xl font-bold text-white mb-8 text-center tracking-wide">Your Fitness Profile</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
                                className="text-center"
                            >
                                <p className="text-sm font-semibold text-gray-400 mb-2">BMI</p>
                                <motion.p
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.5, delay: 0.4, type: "spring", stiffness: 200 }}
                                    className="text-5xl font-extrabold text-orange-500"
                                >
                                    {bmi}
                                </motion.p>
                                <p className="text-lg font-medium text-gray-300 mt-2">{category}</p>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.3, type: "spring" }}
                                className="text-center"
                            >
                                <p className="text-sm font-semibold text-gray-400 mb-2">Health Risk</p>
                                <p className="text-lg font-medium text-gray-300">{healthRisk}</p>
                                {bmi < 18.5 && (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5, delay: 0.5 }}
                                        className="text-sm text-red-500 mt-2 flex items-center justify-center gap-1"
                                    >
                                        <FaExclamationTriangle /> Increase calorie intake (e.g., +500 cal/day)
                                    </motion.p>
                                )}
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.4, type: "spring" }}
                                className="text-center"
                            >
                                <p className="text-sm font-semibold text-gray-400 mb-2">Ideal Weight</p>
                                <p className="text-lg font-medium text-gray-300">{idealWeight}</p>
                            </motion.div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                className="text-center"
                            >
                                <p className="text-sm font-semibold text-gray-400 mb-2 flex items-center justify-center gap-2">
                                    <FaTint className="text-orange-500" /> Water Intake
                                </p>
                                <p className="text-2xl font-bold text-white">{waterIntake}</p>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                                className="text-center"
                            >
                                <p className="text-sm font-semibold text-gray-400 mb-2 flex items-center justify-center gap-2">
                                    <FaHeartbeat className="text-orange-500" /> Resting Heart Rate
                                </p>
                                <motion.p
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                    className="text-2xl font-bold text-white"
                                >
                                    {heartRate}
                                </motion.p>
                            </motion.div>
                        </div>
                        <motion.div
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "100%" }}
                            transition={{ duration: 1.2, delay: 0.7 }}
                            className="mt-8 bg-gray-700 h-3 rounded-full overflow-hidden"
                        >
                            <div
                                className="h-full transition-all duration-1000"
                                style={{
                                    width: `${Math.min((bmi - 15) / 25 * 100, 100)}%`,
                                    background: bmi < 18.5 ? "#ef4444" : bmi < 25 ? "#eab308" : bmi < 30 ? "#f97316" : "#dc2626",
                                }}
                            />
                        </motion.div>
                        <p className="text-center text-gray-400 text-sm mt-2">
                            {bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese"}
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default BMICalculatorPage;