"use client";

import React from "react";
import { motion } from "framer-motion";
import { useUserId } from "@/app/hooks/useUserId";

const Billing = () => {
    const userId = useUserId();

    const plans = [
        { name: "Class Drop-in", price: 39, duration: 30 },
        { name: "12 Months Unlimited", price: 99, duration: 365 },
        { name: "6 Months Unlimited", price: 59, duration: 180 },
    ];

    const handleCheckout = async (plan: string, price: number, duration: number) => {
        if (!userId) return alert("Please log in first!");

        const response = await fetch("/api/checkout", {
            method: "POST",
            body: JSON.stringify({ userId, plan, price, duration }),
        });

        const data = await response.json();
        if (data.url) {
            window.location.href = data.url;
        } else {
            alert("Payment failed");
        }
    };

    return (
        <div id="billing" className="min-h-screen bg-black text-white px-8 py-16 overflow-hidden relative">
            {/* Subtle Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,0,0,0.1),_transparent_70%)] pointer-events-none opacity-50" />
            <div className="absolute inset-0 bg-[url('/gym-texture.png')] opacity-10 pointer-events-none" />

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center text-center mb-16"
                >
                    <h2 className="text-2xl md:text-3xl font-extrabold text-red-500 uppercase tracking-wider">
                        Our Plans
                    </h2>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white uppercase tracking-tight mt-4 drop-shadow-[0_0_10px_rgba(255,0,0,0.3)]">
                        Choose Your Power Pack
                    </h1>
                    <motion.div
                        className="h-1 w-32 bg-gradient-to-r from-red-600 to-orange-600 rounded-full mt-4"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                        viewport={{ once: true }}
                    />
                </motion.div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 * index, ease: "easeOut" }}
                            viewport={{ once: true }}
                            className="relative flex flex-col items-center bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border-2 border-red-900/50 p-8 shadow-[0_0_15px_rgba(255,0,0,0.3)] hover:shadow-[0_0_25px_rgba(255,165,0,0.5)] transition-all duration-500 overflow-hidden"
                        >
                            {/* Animated Background Overlay */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-t from-red-600/10 to-transparent pointer-events-none"
                                animate={{ opacity: [0.5, 0.8, 0.5] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            />

                            {/* Plan Content */}
                            <div className="relative z-10 text-center">
                                <h1 className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-wide">
                                    {plan.name}
                                </h1>
                                <h1 className="text-5xl md:text-6xl font-extrabold text-orange-500 mt-4 drop-shadow-[0_0_10px_rgba(255,165,0,0.5)]">
                                    ${plan.price}
                                </h1>
                                <h2 className="text-xl md:text-2xl font-bold text-gray-300 mt-2">
                                    {plan.duration} Days
                                </h2>
                                <div className="flex flex-col items-center gap-3 mt-6 text-gray-400 font-medium text-sm md:text-base">
                                    <p>Free Riding</p>
                                    <p>Unlimited Equipment Access</p>
                                    <p>Personal Trainer</p>
                                    <p>Weight Loss Classes</p>
                                    <p>Month-to-Month Flexibility</p>
                                    <p>No Time Restrictions</p>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255,165,0,0.6)" }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleCheckout(plan.name, plan.price, plan.duration)}
                                    className="mt-8 px-8 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white text-lg font-extrabold uppercase rounded-full hover:from-red-700 hover:to-orange-700 transition-all duration-300 shadow-[0_0_10px_rgba(255,0,0,0.4)] w-full"
                                >
                                    Join Now
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Billing;