"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useUserId } from "@/app/hooks/useUserId";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

// Dynamically import Confetti to disable SSR
const Confetti = dynamic(() => import("react-confetti"), { ssr: false });

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const userId = useUserId();
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Set window size only on client side
  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Subscription update effect
  useEffect(() => {
    const updateSubscription = async () => {
      if (!session?.user?.id || !userId) return;

      const plan = searchParams.get("plan");
      const price = searchParams.get("price");
      const startDate = searchParams.get("startDate");
      const endDate = searchParams.get("endDate");

      try {
        const res = await fetch("/api/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, plan, price, startDate, endDate }),
        });

        if (res.ok) {
          console.log("Subscription updated successfully!");
        } else {
          console.error("Failed to update subscription:", await res.text());
        }
      } catch (error) {
        console.error("Error updating subscription:", error);
      }
    };

    updateSubscription();
  }, [session, searchParams, userId]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center overflow-hidden relative">
      {/* Confetti Effect - Client-side only */}
      {windowSize.width > 0 && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={150}
          gravity={0.15}
          colors={["#FF0000", "#FF4500", "#D3D3D3"]} // Red-focused palette
          style={{ position: "fixed", top: 0, left: 0, zIndex: 0 }}
        />
      )}

      {/* Subtle Background Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,0,0,0.1),_transparent_70%)] opacity-30 pointer-events-none" />

      {/* Success Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 bg-gray-800 p-8 rounded-2xl border border-red-900/50 shadow-[0_0_20px_rgba(255,0,0,0.2)] max-w-lg w-full mx-4"
      >
        {/* Checkmark Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex justify-center mb-6"
        >
          <CheckCircle className="w-14 h-14 text-red-600" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-3xl font-bold text-center text-white"
        >
          Payment Successful! <span className="text-red-600">🎉</span>
        </motion.h1>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-lg text-gray-300 text-center mt-4"
        >
          Your <span className="text-red-500 font-medium">{searchParams.get("plan") || "Premium"}</span>{" "}
          subscription is now active. Let’s get started!
        </motion.p>

        {/* Subscription Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-6 p-4 bg-gray-700/30 rounded-lg border border-red-700/50"
        >
          <p className="text-sm text-gray-400">
            <span className="font-medium text-white">Price:</span> ${searchParams.get("price") || "N/A"}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            <span className="font-medium text-white">Start Date:</span>{" "}
            {searchParams.get("startDate") || "Today"}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            <span className="font-medium text-white">End Date:</span>{" "}
            {searchParams.get("endDate") || "N/A"}
          </p>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-8 flex justify-center"
        >
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 10px rgba(255,0,0,0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-full shadow-[0_0_10px_rgba(255,0,0,0.3)] hover:from-red-700 hover:to-red-800 transition-all duration-300"
            >
              Go to Dashboard
              <ArrowRight size={18} />
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SuccessPage;