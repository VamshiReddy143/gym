"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import NextImage from "next/image";
import { FaDumbbell, FaUtensils, FaChartLine, FaClock, FaVenus, FaMars } from "react-icons/fa";

const plansData = {
    Male: [
        {
            type: "Bulk",
            image: "/male-bulk-image.jpg",
            description: "Pack on serious muscle with heavy lifts and a calorie surplus tailored for men.",
            accentColor: "#f97316",
            videos: [
                { title: "Men’s Bulking Power Lifts", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
                { title: "Deadlift for Mass", url: "https://www.youtube.com/embed/deadlift-id" },
                { title: "Bulking Nutrition for Men", url: "https://www.youtube.com/embed/nutrition-id" },
            ],
            dietPlan: {
                title: "Men’s Massive Gains Diet",
                meals: [
                    { name: "Breakfast", items: ["Oatmeal (120g)", "Protein Powder (40g)", "Banana (1)", "Peanut Butter (2 tbsp)"], macros: { carbs: 90, protein: 50, fat: 25, calories: 800 }, time: "7:00 AM" },
                    { name: "Lunch", items: ["Chicken Breast (250g)", "Brown Rice (200g)", "Broccoli (150g)", "Olive Oil (1 tbsp)"], macros: { carbs: 90, protein: 60, fat: 20, calories: 800 }, time: "12:00 PM" },
                    { name: "Dinner", items: ["Beef Steak (300g)", "Sweet Potato (250g)", "Asparagus (150g)"], macros: { carbs: 75, protein: 70, fat: 30, calories: 900 }, time: "6:00 PM" },
                    { name: "Snack", items: ["Greek Yogurt (250g)", "Almonds (40g)", "Whey Shake (1 scoop)"], macros: { carbs: 25, protein: 45, fat: 20, calories: 550 }, time: "9:00 PM" },
                ],
                total: { carbs: 280, protein: 225, fat: 95, calories: "3050-3400" },
            },
        },
        {
            type: "Cut",
            image: "/male-cut-image.jpg",
            description: "Shred fat while keeping muscle with cardio and a deficit for men.",
            accentColor: "#dc2626",
            videos: [
                { title: "Men’s HIIT Shred", url: "https://www.youtube.com/embed/hiit-id" },
                { title: "Core Cutting for Men", url: "https://www.youtube.com/embed/core-id" },
                { title: "Cutting Diet for Men", url: "https://www.youtube.com/embed/diet-id" },
            ],
            dietPlan: {
                title: "Men’s Shredded Physique Diet",
                meals: [
                    { name: "Breakfast", items: ["Egg Whites (8)", "Spinach (75g)", "Black Coffee"], macros: { carbs: 5, protein: 30, fat: 0, calories: 140 }, time: "7:30 AM" },
                    { name: "Lunch", items: ["Grilled Tilapia (200g)", "Mixed Greens (150g)", "Lemon Dressing"], macros: { carbs: 10, protein: 45, fat: 5, calories: 300 }, time: "12:30 PM" },
                    { name: "Dinner", items: ["Turkey Breast (200g)", "Steamed Broccoli (200g)", "Avocado (50g)"], macros: { carbs: 15, protein: 50, fat: 15, calories: 400 }, time: "6:30 PM" },
                    { name: "Snack", items: ["Cottage Cheese (150g)", "Cucumber Slices"], macros: { carbs: 5, protein: 20, fat: 5, calories: 150 }, time: "9:30 PM" },
                ],
                total: { carbs: 35, protein: 145, fat: 25, calories: "1600-1800" },
            },
        },
        {
            type: "Lean",
            image: "/male-lean-image.jpg",
            description: "Build a lean, athletic physique with balanced training for men.",
            accentColor: "#eab308",
            videos: [
                { title: "Men’s Lean Muscle Circuit", url: "https://www.youtube.com/embed/lean-circuit-id" },
                { title: "Mobility for Men", url: "https://www.youtube.com/embed/mobility-id" },
                { title: "Lean Nutrition for Men", url: "https://www.youtube.com/embed/nutrition-id" },
            ],
            dietPlan: {
                title: "Men’s Lean Machine Diet",
                meals: [
                    { name: "Breakfast", items: ["Whole Eggs (3)", "Avocado Toast (1 slice)", "Orange (1)"], macros: { carbs: 35, protein: 20, fat: 25, calories: 400 }, time: "7:00 AM" },
                    { name: "Lunch", items: ["Quinoa (120g)", "Grilled Chicken (200g)", "Kale Salad"], macros: { carbs: 50, protein: 50, fat: 10, calories: 550 }, time: "12:00 PM" },
                    { name: "Dinner", items: ["Salmon (200g)", "Asparagus (150g)", "Brown Rice (120g)"], macros: { carbs: 40, protein: 45, fat: 20, calories: 550 }, time: "6:00 PM" },
                    { name: "Snack", items: ["Almonds (30g)", "Apple (1)"], macros: { carbs: 25, protein: 5, fat: 15, calories: 250 }, time: "9:00 PM" },
                ],
                total: { carbs: 150, protein: 120, fat: 70, calories: "2100-2300" },
            },
        },
    ],
    Female: [
        {
            type: "Bulk",
            image: "/female-bulk-image.jpg",
            description: "Gain muscle with strength training and a moderate surplus for women.",
            accentColor: "#f97316",
            videos: [
                { title: "Women’s Bulking Basics", url: "https://www.youtube.com/embed/women-bulk-id" },
                { title: "Glute Growth Lifts", url: "https://www.youtube.com/embed/glute-id" },
                { title: "Nutrition for Women", url: "https://www.youtube.com/embed/nutrition-id" },
            ],
            dietPlan: {
                title: "Women’s Muscle Builder Diet",
                meals: [
                    { name: "Breakfast", items: ["Oatmeal (80g)", "Protein Powder (25g)", "Berries (100g)"], macros: { carbs: 60, protein: 30, fat: 5, calories: 450 }, time: "7:00 AM" },
                    { name: "Lunch", items: ["Chicken Thigh (150g)", "Quinoa (100g)", "Spinach (100g)"], macros: { carbs: 40, protein: 40, fat: 15, calories: 500 }, time: "12:00 PM" },
                    { name: "Dinner", items: ["Lean Beef (150g)", "Sweet Potato (150g)", "Green Beans (100g)"], macros: { carbs: 45, protein: 35, fat: 10, calories: 450 }, time: "6:00 PM" },
                    { name: "Snack", items: ["Greek Yogurt (150g)", "Almond Butter (1 tbsp)"], macros: { carbs: 15, protein: 20, fat: 10, calories: 300 }, time: "9:00 PM" },
                ],
                total: { carbs: 160, protein: 125, fat: 40, calories: "1700-2000" },
            },
        },
        {
            type: "Cut",
            image: "/female-cut-image.jpg",
            description: "Lose fat with targeted cardio and a calorie deficit for women.",
            accentColor: "#dc2626",
            videos: [
                { title: "Women’s Fat Loss HIIT", url: "https://www.youtube.com/embed/women-hiit-id" },
                { title: "Core Toning for Women", url: "https://www.youtube.com/embed/core-id" },
                { title: "Cutting Nutrition Guide", url: "https://www.youtube.com/embed/cut-id" },
            ],
            dietPlan: {
                title: "Women’s Shredded Diet",
                meals: [
                    { name: "Breakfast", items: ["Egg Whites (5)", "Spinach (50g)", "Green Tea"], macros: { carbs: 5, protein: 20, fat: 0, calories: 100 }, time: "7:30 AM" },
                    { name: "Lunch", items: ["Grilled Chicken (120g)", "Mixed Greens (100g)", "Olive Oil (1 tsp)"], macros: { carbs: 5, protein: 30, fat: 5, calories: 200 }, time: "12:30 PM" },
                    { name: "Dinner", items: ["Turkey Breast (120g)", "Steamed Broccoli (150g)"], macros: { carbs: 10, protein: 35, fat: 5, calories: 250 }, time: "6:30 PM" },
                    { name: "Snack", items: ["Cottage Cheese (100g)", "Celery Sticks"], macros: { carbs: 5, protein: 15, fat: 5, calories: 130 }, time: "9:30 PM" },
                ],
                total: { carbs: 25, protein: 100, fat: 15, calories: "1200-1400" },
            },
        },
        {
            type: "Lean",
            image: "/female-lean-image.jpg",
            description: "Tone and define with balanced workouts for women.",
            accentColor: "#eab308",
            videos: [
                { title: "Women’s Lean Sculpt Circuit", url: "https://www.youtube.com/embed/sculpt-id" },
                { title: "Flexibility for Women", url: "https://www.youtube.com/embed/flex-id" },
                { title: "Lean Nutrition for Women", url: "https://www.youtube.com/embed/lean-nutrition-id" },
            ],
            dietPlan: {
                title: "Women’s Lean Goddess Diet",
                meals: [
                    { name: "Breakfast", items: ["Whole Eggs (2)", "Avocado (50g)", "Whole Grain Toast (1)"], macros: { carbs: 25, protein: 15, fat: 15, calories: 300 }, time: "7:00 AM" },
                    { name: "Lunch", items: ["Quinoa (80g)", "Grilled Salmon (120g)", "Arugula Salad"], macros: { carbs: 30, protein: 30, fat: 10, calories: 350 }, time: "12:00 PM" },
                    { name: "Dinner", items: ["Chicken Breast (120g)", "Asparagus (100g)", "Wild Rice (80g)"], macros: { carbs: 30, protein: 30, fat: 5, calories: 350 }, time: "6:00 PM" },
                    { name: "Snack", items: ["Almonds (15g)", "Berries (100g)"], macros: { carbs: 15, protein: 5, fat: 10, calories: 200 }, time: "9:00 PM" },
                ],
                total: { carbs: 100, protein: 80, fat: 40, calories: "1500-1700" },
            },
        },
    ],
};

const PlansPage = () => {
    const [selectedGender, setSelectedGender] = useState<"Male" | "Female" | null>(null);
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [progress, setProgress] = useState<number>(0);

    const handleSelectGender = (gender: "Male" | "Female") => {
        setSelectedGender(gender);
        setSelectedType(null);
        setProgress(0);
    };

    const handleSelectType = (type: string) => {
        setSelectedType(type);
        setProgress(0);
    };

    const updateProgress = () => {
        setProgress((prev) => Math.min(prev + 10, 100));
    };

    const selectedPlan = selectedGender && selectedType ? plansData[selectedGender].find((plan) => plan.type === selectedType) : null;

    return (
        <div className="min-h-screen bg-gray-900 text-white px-8 py-16 overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,75,0,0.1),_transparent_70%)] pointer-events-none opacity-40" />
            <div className="absolute inset-0 bg-[url('/gym-texture.png')] opacity-10 pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-20">
                <motion.h1
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-5xl md:text-7xl font-extrabold text-center uppercase tracking-tight text-white mb-12"
                >
                    Forge Your <span className="text-orange-500">Destiny</span>
                </motion.h1>

                {!selectedGender ? (
                    <div className="flex justify-center gap-8 mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255,255,255,0.1)" }}
                            onClick={() => handleSelectGender("Male")}
                            className="bg-gray-800 p-6 rounded-xl shadow-lg cursor-pointer transition-all duration-300 border border-gray-700 hover:border-blue-500"
                        >
                            <FaMars className="text-blue-500 text-4xl mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-white uppercase tracking-wide">Male</h2>
                            <p className="text-gray-400 mt-2">Plans optimized for men’s physique goals.</p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255,255,255,0.1)" }}
                            onClick={() => handleSelectGender("Female")}
                            className="bg-gray-800 p-6 rounded-xl shadow-lg cursor-pointer transition-all duration-300 border border-gray-700 hover:border-pink-500"
                        >
                            <FaVenus className="text-pink-500 text-4xl mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-white uppercase tracking-wide">Female</h2>
                            <p className="text-gray-400 mt-2">Plans tailored for women’s fitness needs.</p>
                        </motion.div>
                    </div>
                ) : (
                    <>
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            onClick={() => setSelectedGender(null)}
                            className="mb-8 px-6 py-2 bg-gray-700 text-white text-lg font-semibold rounded-full hover:bg-gray-600 transition-all duration-300"
                        >
                            Back to Gender Selection
                        </motion.button>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                            {plansData[selectedGender].map((plan) => (
                                <motion.div
                                    key={plan.type}
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.01, delay: 0.2 * plansData[selectedGender].indexOf(plan), ease: "easeOut" }}
                                    whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255,255,255,0.1)" }}
                                    onClick={() => handleSelectType(plan.type)}
                                    className={`bg-gray-800 p-4 rounded-xl shadow-lg cursor-pointer transition-all duration-300 border border-gray-700 hover:border-${plan.accentColor}-500 ${
                                        selectedType === plan.type ? `border-${plan.accentColor}-500 scale-105` : ""
                                    }`}
                                >
                                    <NextImage
                                        src={plan.image}
                                        alt={plan.type}
                                        width={300}
                                        height={300}
                                        className="w-full h-full object-cover rounded-lg mb-4"
                                    />
                                    <h2 className="text-xl font-bold text-white uppercase tracking-wide">{plan.type}</h2>
                                    <p className="text-gray-400 mt-2 text-sm">{plan.description}</p>
                                </motion.div>
                            ))}
                        </div>

                        {selectedPlan && (
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700"
                            >
                                <h2 className="text-4xl md:text-5xl font-extrabold text-white uppercase tracking-wide mb-8">
                                    {selectedGender} {selectedPlan.type}{" "}
                                    <span style={{ color: selectedPlan.accentColor }}>Blueprint</span>
                                </h2>

                                <div className="mb-12">
                                    <h3 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                                        <FaChartLine className="text-orange-500" /> Progress Tracker
                                    </h3>
                                    <div className="bg-gray-700 rounded-full h-3 w-full overflow-hidden">
                                        <motion.div
                                            className="bg-orange-500 h-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                        />
                                    </div>
                                    <p className="text-gray-400 mt-2">{progress}% Complete</p>
                                    <motion.button
                                        whileHover={{ scale: 1.05, boxShadow: "0 0 10px rgba(255,165,0,0.5)" }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={updateProgress}
                                        className="mt-4 px-6 py-2 bg-orange-500 text-white text-lg font-semibold rounded-full hover:bg-orange-600 transition-all duration-300"
                                    >
                                        Log Workout
                                    </motion.button>
                                </div>

                                <div className="mb-12">
                                    <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                                        <FaDumbbell className="text-orange-500" /> Training Videos
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {selectedPlan.videos.map((video, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: -50 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                                className="bg-gray-700 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300"
                                            >
                                                <iframe
                                                    width="100%"
                                                    height="150"
                                                    src={video.url}
                                                    title={video.title}
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    className="rounded-md"
                                                ></iframe>
                                                <p className="text-lg font-medium text-white mt-2">{video.title}</p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Revamped Diet Plan Section */}
                                <div>
                                    <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                                        <FaUtensils className="text-orange-500" /> Fuel Your Gains
                                    </h3>
                                    <div className="bg-gray-850 rounded-xl p-6 shadow-lg border border-gray-700">
                                        <div className="flex justify-between items-center mb-8">
                                            <h4 className="text-xl font-bold text-white tracking-wide">{selectedPlan.dietPlan.title}</h4>
                                            <div className="flex gap-4 text-sm text-gray-300">
                                                <span className="flex items-center gap-1"><span className="text-orange-500 font-semibold">{selectedPlan.dietPlan.total.calories}</span> cal</span>
                                                <span className="flex items-center gap-1"><span className="text-orange-500 font-semibold">{selectedPlan.dietPlan.total.protein}g</span> pro</span>
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            {selectedPlan.dietPlan.meals.map((meal, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                                    className="bg-gray-900 p-5 rounded-lg shadow-md flex items-center gap-4 hover:bg-gray-880 transition-all duration-300"
                                                >
                                                    <div className="flex-shrink-0 w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
                                                        <FaClock className="text-orange-500 text-2xl" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <h5 className="text-lg font-semibold text-white">{meal.name}</h5>
                                                            <span className="text-gray-500 text-sm">{meal.time}</span>
                                                        </div>
                                                        <ul className="text-gray-300 text-sm space-y-1">
                                                            {meal.items.map((item, i) => (
                                                                <li key={i} className="flex items-center gap-2">
                                                                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                                                                    {item}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                        <div className="mt-3 flex justify-between text-xs text-gray-400">
                                                            <span>C: {meal.macros.carbs}g</span>
                                                            <span>P: {meal.macros.protein}g</span>
                                                            <span>F: {meal.macros.fat}g</span>
                                                            <span>{meal.macros.calories} cal</span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.5, delay: 0.5 }}
                                            className="mt-8 p-4 bg-gray-900 rounded-lg shadow-md flex justify-around items-center text-sm text-gray-300"
                                        >
                                            <div className="text-center">
                                                <p className="text-orange-500 font-semibold">{selectedPlan.dietPlan.total.carbs}g</p>
                                                <p>Carbs</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-orange-500 font-semibold">{selectedPlan.dietPlan.total.protein}g</p>
                                                <p>Protein</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-orange-500 font-semibold">{selectedPlan.dietPlan.total.fat}g</p>
                                                <p>Fat</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-orange-500 font-semibold">{selectedPlan.dietPlan.total.calories}</p>
                                                <p>Calories</p>
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default PlansPage;