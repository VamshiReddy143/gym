"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaTimesCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";

const CancelPage = () => {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-black text-white px-8 py-16 overflow-hidden relative flex justify-center items-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,0,0,0.2),_transparent_70%)] pointer-events-none opacity-50" />
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-3xl shadow-[0_0_30px_rgba(255,165,0,0.6)] text-center max-w-md w-full"
            >
                <FaTimesCircle className="text-red-500 text-6xl mx-auto mb-6" />
                <h1 className="text-3xl md:text-4xl font-extrabold uppercase tracking-wide text-white mb-4 drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]">
                    Payment Cancelled
                </h1>
                <p className="text-lg md:text-xl text-gray-300 font-medium mb-6">
                    Your payment was cancelled. Return to the products page to continue shopping.
                </p>
                <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255,165,0,0.5)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push("/products")}
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white text-lg font-bold uppercase rounded-full hover:from-red-700 hover:to-orange-700 transition-all duration-300 shadow-[0_0_10px_rgba(255,0,0,0.3)]"
                >
                    Back to Products
                </motion.button>
            </motion.div>
        </div>
    );
};

export default CancelPage;