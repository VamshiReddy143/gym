"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Loading: React.FC = () => {
    const [isHydrated, setIsHydrated] = useState(false);

    // Set hydration flag on client-side mount
    useEffect(() => {
        setIsHydrated(true);
    }, []);

    // Animation variants for the spinning ring
    const ringVariants = {
        animate: {
            rotate: 360,
            scale: [1, 1.2, 1],
            transition: {
                rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
                scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
            },
        },
    };

    // Animation variants for the pulsing text
    const textVariants = {
        animate: {
            opacity: [0.5, 1, 0.5],
            y: [-5, 5, -5],
            transition: {
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
            },
        },
    };

    // Animation variants for the orbiting dots
    const dotVariants = {
        initial: { x: 0, y: 0 },
        animate: (i: number) => ({
            x: [0, 50 * Math.sin((i * 120 * Math.PI) / 180), 0],
            y: [0, 50 * Math.cos((i * 120 * Math.PI) / 180), 0],
            rotate: 360,
            transition: {
                x: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 },
                y: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 },
                rotate: { duration: 2, repeat: Infinity, ease: "linear", delay: i * 0.3 },
            },
        }),
    };

    // Static render for SSR and pre-hydration
    if (!isHydrated) {
        return (
            <div className="fixed inset-0 bg-black flex justify-center items-center z-50">
                {/* Static radial gradient */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,0,0,0.2),_transparent_70%)] pointer-events-none opacity-50" />
                {/* Static ring */}
                <div className="w-24 h-24 md:w-32 md:h-32 border-8 border-t-red-600 border-r-orange-600 border-b-transparent border-l-transparent rounded-full shadow-[0_0_25px_rgba(255,165,0,0.7)] animate-spin" />
                {/* Static text */}
                <h1 className="text-3xl md:text-4xl font-extrabold text-white uppercase tracking-wider drop-shadow-[0_0_15px_rgba(255,0,0,0.5)] mt-6">
                    Powering Up...
                </h1>
                {/* Static gym icon */}
                <div className="text-5xl md:text-6xl text-orange-500 drop-shadow-[0_0_10px_rgba(255,165,0,0.7)] mt-6">
                    💪
                </div>
            </div>
        );
    }

    // Animated render for client-side post-hydration
    return (
        <div className="fixed inset-0 bg-black flex justify-center items-center z-50">
            {/* Animated Background Gradient */}
            <motion.div
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,0,0,0.2),_transparent_70%)] pointer-events-none"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Main Loading Container */}
            <div className="relative flex flex-col items-center gap-6">
                {/* Spinning Ring with Gradient */}
                <motion.div
                    variants={ringVariants}
                    animate="animate"
                    className="w-24 h-24 md:w-32 md:h-32 border-8 border-t-red-600 border-r-orange-600 border-b-transparent border-l-transparent rounded-full shadow-[0_0_25px_rgba(255,165,0,0.7)]"
                >
                    {/* Orbiting Dots */}
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            custom={i}
                            variants={dotVariants}
                            initial="initial"
                            animate="animate"
                            className="absolute w-4 h-4 bg-gradient-to-r from-red-600 to-orange-600 rounded-full shadow-[0_0_10px_rgba(255,165,0,0.5)]"
                            style={{
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                            }}
                        />
                    ))}
                </motion.div>

                {/* Pulsing Text */}
                <motion.h1
                    variants={textVariants}
                    animate="animate"
                    className="text-3xl md:text-4xl font-extrabold text-white uppercase tracking-wider drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]"
                >
                    Powering Up...
                </motion.h1>

                {/* Subtle Gym Icon */}
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="text-5xl md:text-6xl text-orange-500 drop-shadow-[0_0_10px_rgba(255,165,0,0.7)]"
                >
                    💪
                </motion.div>
            </div>
        </div>
    );
};

export default Loading;