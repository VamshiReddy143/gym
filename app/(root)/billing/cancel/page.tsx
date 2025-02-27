"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { XCircle, ArrowRight } from "lucide-react";

const CancelPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center overflow-hidden relative">
      {/* Subtle Background Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,0,0,0.1),_transparent_70%)] opacity-30 pointer-events-none" />
      <motion.div
        className="absolute inset-0 bg-red-600/10 pointer-events-none"
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Cancel Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 bg-gray-800 p-8 rounded-2xl border border-red-900/50 shadow-[0_0_20px_rgba(255,0,0,0.2)] max-w-md w-full mx-4"
      >
        {/* Cancel Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex justify-center mb-6"
        >
          <XCircle className="w-14 h-14 text-red-600" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-3xl font-bold text-center text-white"
        >
          Payment Canceled <span className="text-red-600">❌</span>
        </motion.h1>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-lg text-gray-300 text-center mt-4"
        >
          It looks like your payment didn’t go through. Want to give it another shot?
        </motion.p>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-8 flex justify-center"
        >
          <Link href="/billing">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 10px rgba(255,0,0,0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-full shadow-[0_0_10px_rgba(255,0,0,0.3)] hover:from-red-700 hover:to-red-800 transition-all duration-300"
            >
              Try Again
              <ArrowRight size={18} />
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CancelPage;