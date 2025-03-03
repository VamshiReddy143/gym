"use client";

import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import cardio from "@/public/cardio.png";
import weightlifting from "@/public/lifting.png";
import bodybalancing from "@/public/balancing.png";
import body from "@/public/body.png";
import yoga from "@/public/yoga.png";
import beginner from "@/public/beginner.png";
import Link from "next/link";

const OurProgramms = () => {
    return (
        <div id="services"  className="  min-h-screen bg-black text-white px-8 py-16 overflow-hidden relative">
            {/* Subtle Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,0,0,0.1),_transparent_70%)] pointer-events-none opacity-50" />
            <div className="absolute inset-0 bg-[url('/gym-texture.png')] opacity-10 pointer-events-none" />

            <div className="max-w-10xl mx-auto">
                {/* Header */}

               
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center text-center mb-16"
                >
                    <h2 className="text-2xl md:text-3xl font-extrabold text-red-500 uppercase tracking-wider">
                        Our Services
                    </h2>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white uppercase tracking-tight mt-4 drop-shadow-[0_0_10px_rgba(255,0,0,0.3)]">
                        Training Programs
                    </h1>
                    <motion.div
                        className="h-1 w-24 bg-gradient-to-r from-red-600 to-orange-600 rounded-full mt-4"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                        viewport={{ once: true }}
                    />
                </motion.div>

                {/* Programs Grid */}
                <div className="grid grid-cols-1 cursor-pointer sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {/* Program 1: Cardio Strength */}
                    <Link href={"/plans"}>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-3xl shadow-[0_0_15px_rgba(255,0,0,0.3)] hover:shadow-[0_0_25px_rgba(255,165,0,0.5)] transition-all duration-300"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 2 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative"
                        >
                            <Image
                                src={cardio}
                                alt="Cardio Strength"
                                width={500}
                                height={400}
                                className="sm:h-[400px] sm:w-[500px] h-[300px] w-full object-cover rounded-2xl shadow-[0_0_10px_rgba(0,0,0,0.7)]"
                            />
                        </motion.div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-wide mt-6">
                            Cardio Strength
                        </h1>
                        <p className="text-gray-400 mt-4 text-center text-sm md:text-lg font-medium">
                            Boost your heart rate and build unbreakable endurance with high-intensity cardio.
                        </p>
                    </motion.div>
                    </Link>

                    {/* Program 2: Weight Lifting */}
                    <Link href={"/plans"}>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-3xl shadow-[0_0_15px_rgba(255,0,0,0.3)] hover:shadow-[0_0_25px_rgba(255,165,0,0.5)] transition-all duration-300"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 2 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative"
                        >
                            <Image
                                src={weightlifting}
                                alt="Weight Lifting"
                                width={500}
                                height={400}
                                className="sm:h-[400px] sm:w-[500px] h-[300px] w-full object-cover rounded-2xl shadow-[0_0_10px_rgba(0,0,0,0.7)]"
                            />
                        </motion.div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-wide mt-6">
                            Weight Lifting
                        </h1>
                        <p className="text-gray-400 mt-4 text-center text-sm md:text-lg font-medium">
                            Forge raw power and sculpt your physique with heavy iron.
                        </p>
                    </motion.div>
                    </Link>

                    {/* Program 3: Body Balancing */}
                    <Link href={"/plans"}>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-3xl shadow-[0_0_15px_rgba(255,0,0,0.3)] hover:shadow-[0_0_25px_rgba(255,165,0,0.5)] transition-all duration-300"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 2 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative"
                        >
                            <Image
                                src={bodybalancing}
                                alt="Body Balancing"
                                width={500}
                                height={400}
                                className="sm:h-[400px] sm:w-[500px] h-[300px] w-full object-cover rounded-2xl shadow-[0_0_10px_rgba(0,0,0,0.7)]"
                            />
                        </motion.div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-wide mt-6">
                            Body Balancing
                        </h1>
                        <p className="text-gray-400 mt-4 text-center text-sm md:text-lg font-medium">
                            Master stability and coordination for peak performance.
                        </p>
                    </motion.div>
                    </Link>

                    {/* Program 4: Muscle Stretching */}
                    <Link href={"/plans"}>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-3xl shadow-[0_0_15px_rgba(255,0,0,0.3)] hover:shadow-[0_0_25px_rgba(255,165,0,0.5)] transition-all duration-300"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 2 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative"
                        >
                            <Image
                                src={body}
                                alt="Muscle Stretching"
                                width={500}
                                height={400}
                                className="sm:h-[400px] sm:w-[500px] h-[300px] w-full object-cover rounded-2xl shadow-[0_0_10px_rgba(0,0,0,0.7)]"
                            />
                        </motion.div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-wide mt-6">
                            Muscle Stretching
                        </h1>
                        <p className="text-gray-400 mt-4 text-center text-sm md:text-lg font-medium">
                            Enhance flexibility and recovery with targeted stretches.
                        </p>
                    </motion.div>
                    </Link>

                    {/* Program 5: Basic Yoga */}
                    <Link href={"/plans"}>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-3xl shadow-[0_0_15px_rgba(255,0,0,0.3)] hover:shadow-[0_0_25px_rgba(255,165,0,0.5)] transition-all duration-300"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 2 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative"
                        >
                            <Image
                                src={yoga}
                                alt="Basic Yoga"
                                width={500}
                                height={400}
                                className="sm:h-[400px] sm:w-[500px] h-[300px] w-full object-cover rounded-2xl shadow-[0_0_10px_rgba(0,0,0,0.7)]"
                            />
                        </motion.div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-wide mt-6">
                            Basic Yoga
                        </h1>
                        <p className="text-gray-400 mt-4 text-center text-sm md:text-lg font-medium">
                            Find balance and inner strength through mindful movement.
                        </p>
                    </motion.div>
                    </Link>

                    {/* Program 6: Beginner Pilates */}
                    <Link href={"/plans"}>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-3xl shadow-[0_0_15px_rgba(255,0,0,0.3)] hover:shadow-[0_0_25px_rgba(255,165,0,0.5)] transition-all duration-300"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 2 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative"
                        >
                            <Image
                                src={beginner}
                                alt="Beginner Pilates"
                                width={500}
                                height={400}
                                className="sm:h-[400px] sm:w-[500px] h-[300px] w-full object-cover rounded-2xl shadow-[0_0_10px_rgba(0,0,0,0.7)]"
                            />
                        </motion.div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-wide mt-6">
                            Beginner Pilates
                        </h1>
                        <p className="text-gray-400 mt-4 text-center text-sm md:text-lg font-medium">
                            Strengthen your core and kickstart your fitness journey.
                        </p>
                    </motion.div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OurProgramms;