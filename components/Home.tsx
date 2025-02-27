"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import hero1 from "@/public/gymlogo1.jpg";

const Home = () => {
    // Animation variants for the hero stats
    const statVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, delay: i * 0.3, ease: "easeOut" },
        }),
    };

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden relative">
            {/* Enhanced Background Effects */}
            <motion.div
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,0,0,0.25),_transparent_70%)] pointer-events-none"
                animate={{ opacity: [0.5, 0.7, 0.5] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* <div className="absolute inset-0 bg-[url('/gym-texture.png')] opacity-20 pointer-events-none" /> 

            {/* Hero Section */}
            <div className="max-w-8xl mx-auto px-8 py-10 relative z-20">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                    {/* Text & CTA Section */}
                    <div className="lg:w-[50%] text-center lg:text-left relative z-20">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut", type: "spring", stiffness: 100 }}
                            className="flex justify-center lg:justify-start items-center gap-4 mb-6"
                        >
                            <Image
                                src={hero1}
                                alt="Gym Logo"
                                width={60}
                                height={60}
                                className="rounded-full shadow-[0_0_15px_rgba(255,165,0,0.6)]"
                            />
                            <h2 className="text-2xl md:text-3xl font-extrabold text-red-500 uppercase tracking-wider">
                                Since 1998
                            </h2>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.2, ease: "easeOut", type: "spring", stiffness: 80 }}
                            className="text-5xl md:text-7xl lg:text-8xl font-extrabold uppercase tracking-tighter text-white leading-tight drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]"
                        >
                            Forge Your
                            <span className="block bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                                Ultimate Power
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                            className="text-lg md:text-xl text-gray-300 font-medium mt-6 lg:w-[85%] leading-relaxed drop-shadow-[0_0_5px_rgba(255,165,0,0.3)]"
                        >
                            Transform your body and mind with elite training. Join a legacy of strength—your journey starts here.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut", type: "spring", stiffness: 100 }}
                            className="mt-10 flex flex-col sm:flex-row gap-6 justify-center lg:justify-start"
                        >
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(255,165,0,0.8)" }}
                                whileTap={{ scale: 0.95 }}
                                className="px-10 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white text-xl font-extrabold uppercase rounded-full hover:from-red-700 hover:to-orange-700 transition-all duration-300 shadow-[0_0_15px_rgba(255,0,0,0.6)] tracking-widest relative overflow-hidden"
                            >
                                <span className="relative z-10">Join Now</span>
                                <motion.div
                                    className="absolute inset-0 bg-orange-600/40"
                                    animate={{ x: ["-100%", "100%"] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255,165,0,0.5)" }}
                                whileTap={{ scale: 0.95 }}
                                className="px-10 py-4 bg-transparent border-2 border-orange-500 text-white text-xl font-extrabold uppercase rounded-full hover:bg-orange-500/20 transition-all duration-300 tracking-widest"
                            >
                                Learn More
                            </motion.button>
                        </motion.div>

                        {/* New: Dynamic Gym Stats */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="mt-12 flex flex-wrap justify-center lg:justify-start gap-8 text-gray-300 text-base md:text-lg font-semibold"
                        >
                            <motion.div custom={0} variants={statVariants} className="flex items-center gap-3">
                                <span className="text-orange-500 text-3xl">💪</span>
                                <span>25+ Years of Excellence</span>
                            </motion.div>
                            <motion.div custom={1} variants={statVariants} className="flex items-center gap-3">
                                <span className="text-orange-500 text-3xl">🏋️‍♂️</span>
                                <span>Elite Training Gear</span>
                            </motion.div>
                            <motion.div custom={2} variants={statVariants} className="flex items-center gap-3">
                                <span className="text-orange-500 text-3xl">🔥</span>
                                <span>100K+ Transformed Lives</span>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Image Section with Enhanced Effects */}
                    <div className="lg:w-[50%] relative z-20">
                        {/* Animated Background Effect */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-red-600/30 to-orange-600/30 rounded-xl blur-3xl z-10"
                            animate={{
                                scale: [1, 1.05, 1],
                                opacity: [0.6, 0.8, 0.6],
                                rotate: [0, 2, 0],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-xl blur-4xl z-10"
                            animate={{
                                scale: [1.05, 1, 1.05],
                                opacity: [0.5, 0.7, 0.5],
                                rotate: [2, 0, 2],
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 1,
                            }}
                        />

                        {/* Hero Image */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 1.2, delay: 0.8, ease: "easeOut", type: "spring", stiffness: 80 }}
                            className="relative z-20"
                        >
                            <Image
                                src={hero1}
                                alt="Hero"
                                width={800}
                                height={800}
                                className="max-w-full lg:h-[50em] h-[35em] object-cover rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.9)] hover:scale-105 transition-all duration-500 cursor-pointer"
                            />
                            {/* Power Surge Effect */}
                            <motion.div
                                className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,165,0,0.3),_transparent_70%)] z-10 pointer-events-none"
                                animate={{ opacity: [0, 0.5, 0], scale: [1, 1.2, 1] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: 2 }}
                            />
                        </motion.div>

                        {/* Enhanced Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 30, rotate: -10 }}
                            animate={{ opacity: 1, y: 0, rotate: 0 }}
                            transition={{ delay: 1.2, duration: 0.8, ease: "easeOut", type: "spring", stiffness: 100 }}
                            className="absolute -bottom-8 -left-8 bg-gradient-to-r from-red-600 to-orange-600 text-white text-lg md:text-xl font-extrabold px-6 py-3 rounded-full shadow-[0_0_15px_rgba(255,0,0,0.8)] uppercase z-20 flex items-center gap-3"
                        >
                            <span>Est. 1998</span>
                            <motion.span
                                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="text-2xl md:text-3xl"
                            >
                                💪
                            </motion.span>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Animated Spotlight Sweep */}
            <motion.div
                className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
                animate={{
                    background: [
                        "linear-gradient(45deg, rgba(255,0,0,0.15) 0%, transparent 50%)",
                        "linear-gradient(45deg, transparent 0%, rgba(255,165,0,0.15) 50%)",
                        "linear-gradient(45deg, rgba(255,0,0,0.15) 0%, transparent 50%)",
                    ],
                    x: ["-100%", "100%", "-100%"],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />

            {/* New: Cinematic Overlay Line */}
            <motion.div
                className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-orange-500 to-transparent z-20"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 2, ease: "easeOut", delay: 1.5 }}
            />
        </div>
    );
};

export default Home;