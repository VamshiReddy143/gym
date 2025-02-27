"use client";

import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import trainer from "@/public/trainer.jpg";
import trainer1 from "@/public/trainer3.jpg";
import trainer2 from "@/public/trainer2.jpg";

const Trainers = () => {
    return (
        <div className="min-h-screen bg-black text-white px-8 py-16 overflow-hidden relative">
            {/* Subtle Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,0,0,0.1),_transparent_70%)] pointer-events-none opacity-50" />
            <div className="absolute inset-0 bg-[url('/gym-texture.png')] opacity-10 pointer-events-none" />

            <div className="max-w-7xl mx-auto">
                {/* Heading Section */}
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-2xl md:text-3xl font-extrabold text-red-500 uppercase tracking-wider">
                        Trainers
                    </h2>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white uppercase tracking-tight mt-4 drop-shadow-[0_0_10px_rgba(255,0,0,0.3)]">
                        Meet Your Elite Coaches
                    </h1>
                    <motion.div
                        className="h-1 w-32 bg-gradient-to-r from-red-600 to-orange-600 rounded-full mt-4 mx-auto"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                        viewport={{ once: true }}
                    />
                </motion.div>

                {/* Trainers Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                    {/* Trainer 1: John */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="relative flex flex-col items-center bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-[0_0_15px_rgba(255,0,0,0.3)] hover:shadow-[0_0_25px_rgba(255,165,0,0.5)] transition-all duration-300 overflow-hidden"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 1 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative w-full"
                        >
                            <Image
                                src={trainer}
                                alt="John"
                                width={300}
                                height={400}
                                className="sm:h-[400px] sm:w-full h-[300px] w-full object-cover rounded-t-3xl shadow-[0_0_10px_rgba(0,0,0,0.7)]"
                            />
                            {/* Subtle Animated Overlay */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-t from-red-600/10 to-transparent pointer-events-none"
                                animate={{ opacity: [0.5, 0.8, 0.5] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </motion.div>
                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-r from-red-600 to-orange-600 p-6 rounded-tl-3xl rounded-br-3xl">
                            <h1 className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-wide">
                                John
                            </h1>
                            <h3 className="text-lg md:text-xl font-bold text-gray-200">Strength Specialist</h3>
                        </div>
                    </motion.div>

                    {/* Trainer 2: Albert */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="relative flex flex-col items-center bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-[0_0_15px_rgba(255,0,0,0.3)] hover:shadow-[0_0_25px_rgba(255,165,0,0.5)] transition-all duration-300 overflow-hidden"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 1 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative w-full"
                        >
                            <Image
                                src={trainer2}
                                alt="Albert"
                                width={300}
                                height={400}
                                className="sm:h-[400px] sm:w-full h-[300px] w-full object-cover rounded-t-3xl shadow-[0_0_10px_rgba(0,0,0,0.7)]"
                            />
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-t from-red-600/10 to-transparent pointer-events-none"
                                animate={{ opacity: [0.5, 0.8, 0.5] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </motion.div>
                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-r from-red-600 to-orange-600 p-6 rounded-tl-3xl rounded-br-3xl">
                            <h1 className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-wide">
                                Albert
                            </h1>
                            <h3 className="text-lg md:text-xl font-bold text-gray-200">Powerlifting Pro</h3>
                        </div>
                    </motion.div>

                    {/* Trainer 3: Punk */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="relative flex flex-col items-center bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-[0_0_15px_rgba(255,0,0,0.3)] hover:shadow-[0_0_25px_rgba(255,165,0,0.5)] transition-all duration-300 overflow-hidden"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 1 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative w-full"
                        >
                            <Image
                                src={trainer1}
                                alt="Punk"
                                width={300}
                                height={400}
                                className="sm:h-[400px] sm:w-full h-[300px] w-full object-cover rounded-t-3xl shadow-[0_0_10px_rgba(0,0,0,0.7)]"
                            />
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-t from-red-600/10 to-transparent pointer-events-none"
                                animate={{ opacity: [0.5, 0.8, 0.5] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </motion.div>
                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-r from-red-600 to-orange-600 p-6 rounded-tl-3xl rounded-br-3xl">
                            <h1 className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-wide">
                                Punk
                            </h1>
                            <h3 className="text-lg md:text-xl font-bold text-gray-200">Fitness Innovator</h3>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Trainers;