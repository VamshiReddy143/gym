"use client";

import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import couple from "@/public/hero.png";
import { SpinningText } from "./magicui/spinning-text";
import muscle from "@/public/muscle.png";
import strength from "@/public/strength.png";
import flexibility from "@/public/flexibility.png";
import endurance from "@/public/endurance.png";

const WhyChooseUs = () => {
    return (
        <div className="min-h-screen bg-black text-white px-8 py-16 overflow-hidden relative flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">
            {/* Subtle Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,0,0,0.1),_transparent_70%)] pointer-events-none opacity-50" />
            <div className="absolute inset-0 bg-[url('/gym-texture.png')] opacity-10 pointer-events-none" />

            {/* Image Section */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                viewport={{ once: true }}
                className="relative flex items-center justify-center lg:w-1/2 z-20"
            >
                {/* Animated Background Effect */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-full blur-2xl z-10"
                    animate={{
                        scale: [1, 1.05, 1],
                        opacity: [0.6, 0.8, 0.6],
                        rotate: [0, 3, 0],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <Image
                    src={couple}
                    alt="Hero"
                    width={900}
                    height={800}
                    className="max-w-[100%]  h-auto sm:h-[400px] lg:h-[500px] object-cover rounded-full  hover:scale-105 transition-all duration-500 z-[999]"
                />
                <motion.div
                    initial={{ opacity: 0, rotate: -10 }}
                    whileInView={{ opacity: 1, rotate: 0 }}
                    transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
                >
                    <SpinningText className="text-orange-500 text-5xl sm:text-6xl lg:text-8xl font-extrabold tracking-wide drop-shadow-[0_0_10px_rgba(255,165,0,0.6)]">
                        Train Hard • Win Big • Grow Strong •
                    </SpinningText>
                </motion.div>
            </motion.div>

            {/* Features Section */}
            <div className="flex flex-col items-center lg:items-start lg:w-1/2 relative z-20">
                <motion.h2
                    initial={{ opacity: 0, y: -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="text-xl sm:text-2xl font-extrabold text-red-500 uppercase tracking-wider"
                >
                    Our Elite Features
                </motion.h2>
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white uppercase tracking-tight mt-4 drop-shadow-[0_0_10px_rgba(255,0,0,0.3)]"
                >
                    Why Choose Us?
                </motion.h1>

                {/* Feature Cards */}
                <div className="grid grid-cols-2 gap-8 sm:gap-10 mt-12">
                    {/* Feature 1 */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="flex flex-col items-start gap-4"
                    >
                        <motion.div
                            whileHover={{ scale: 1.15, rotate: 6, boxShadow: "0 0 15px rgba(255,165,0,0.5)" }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center justify-center w-[80px] sm:w-[100px] h-[80px] sm:h-[100px] p-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-[0_0_10px_rgba(255,0,0,0.3)] transition-all duration-300"
                        >
                            <Image src={muscle} alt="Muscle" width={40} height={40} />
                        </motion.div>
                        <div className="flex flex-col lg:w-[70%]">
                            <h1 className="text-xl sm:text-2xl font-extrabold text-white uppercase tracking-wide">
                                Progression
                            </h1>
                            <p className="text-sm sm:text-lg text-gray-400 font-medium">
                                Smash plateaus with expert guidance.
                            </p>
                        </div>
                    </motion.div>

                    {/* Feature 2 */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="flex flex-col items-start gap-4"
                    >
                        <motion.div
                            whileHover={{ scale: 1.15, rotate: 6, boxShadow: "0 0 15px rgba(255,165,0,0.5)" }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center justify-center w-[80px] sm:w-[100px] h-[80px] sm:h-[100px] p-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-[0_0_10px_rgba(255,0,0,0.3)] transition-all duration-300"
                        >
                            <Image src={strength} alt="Strength" width={40} height={40} />
                        </motion.div>
                        <div className="flex flex-col lg:w-[70%]">
                            <h1 className="text-xl sm:text-2xl font-extrabold text-white uppercase tracking-wide">
                                Strength
                            </h1>
                            <p className="text-sm sm:text-lg text-gray-400 font-medium">
                                Unleash raw power and resilience.
                            </p>
                        </div>
                    </motion.div>

                    {/* Feature 3 */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="flex flex-col items-start gap-4"
                    >
                        <motion.div
                            whileHover={{ scale: 1.15, rotate: 6, boxShadow: "0 0 15px rgba(255,165,0,0.5)" }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center justify-center w-[80px] sm:w-[100px] h-[80px] sm:h-[100px] p-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-[0_0_10px_rgba(255,0,0,0.3)] transition-all duration-300"
                        >
                            <Image src={flexibility} alt="Flexibility" width={40} height={40} />
                        </motion.div>
                        <div className="flex flex-col lg:w-[70%]">
                            <h1 className="text-xl sm:text-2xl font-extrabold text-white uppercase tracking-wide">
                                Flexibility
                            </h1>
                            <p className="text-sm sm:text-lg text-gray-400 font-medium">
                                Move freer, perform better.
                            </p>
                        </div>
                    </motion.div>

                    {/* Feature 4 */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="flex flex-col items-start gap-4"
                    >
                        <motion.div
                            whileHover={{ scale: 1.15, rotate: 6, boxShadow: "0 0 15px rgba(255,165,0,0.5)" }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center justify-center w-[80px] sm:w-[100px] h-[80px] sm:h-[100px] p-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-[0_0_10px_rgba(255,0,0,0.3)] transition-all duration-300"
                        >
                            <Image src={endurance} alt="Endurance" width={40} height={40} />
                        </motion.div>
                        <div className="flex flex-col lg:w-[70%]">
                            <h1 className="text-xl sm:text-2xl font-extrabold text-white uppercase tracking-wide">
                                Endurance
                            </h1>
                            <p className="text-sm sm:text-lg text-gray-400 font-medium">
                                Outlast every challenge.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default WhyChooseUs;