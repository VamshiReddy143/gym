"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import NextImage from "next/image";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCrown, FaFire, FaAward, FaClock, FaArrowLeft } from "react-icons/fa";
import Loading from "@/components/Loading";

// Type Definition
interface IUser {
  _id: string;
  googleId?: string;
  image?: string;
  name: string;
  email: string;
  password?: string;
  phonenumber?: number;
  Address?: string;
  isAdmin: boolean;
  role: "admin" | "user" | "trainer";
  gender?: string;
  subscription?: {
    plan: string;
    startDate: string;
    endDate: string;
    price: number;
    qrCode: string;
  };
  streak: number;
  points: number;
  lastChallengeDate: string | null;
  completedChallenges: string[];
  awards: string[];
  createdAt:Date
}

// Animation Variants
const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.15 } },
  },
  header: {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.6, -0.05, 0.01, 0.99] } },
  },
  card: {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, type: "spring", stiffness: 120 } },
    hover: { scale: 1.02, transition: { duration: 0.3, ease: "easeOut" } },
  },
  item: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
  },
  button: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
    hover: { scale: 1.05, boxShadow: "0 0 15px rgba(255, 75, 0, 0.5)" },
    tap: { scale: 0.95 },
  },
  glowPulse: {
    animate: { scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] },
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
  },
  streakGlow: {
    animate: { boxShadow: ["0 0 10px rgba(255, 75, 0, 0.5)", "0 0 20px rgba(255, 75, 0, 0.8)", "0 0 10px rgba(255, 75, 0, 0.5)"] },
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
  },
};

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { userId } = useParams();

  // Fetch User Profile
  const fetchUserProfile = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const { data } = await axios.get<{ success: boolean; user?: IUser; message?: string }>(`/api/users/${userId}`);
      if (data.success && data.user) {
        setUser(data.user);
      } else {
        setError(data.message || "Failed to fetch user profile");
      }
    } catch (err) {
      setError("An error occurred while fetching the profile");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  // Error or No User State
  if (error || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex justify-center items-center">
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-red-400 text-lg sm:text-2xl font-bold tracking-wide"
          role="alert"
        >
          {error || "User not found"}
        </motion.p>
      </div>
    );
  }

  const isSubscriptionActive = user.subscription && new Date(user.subscription.endDate) > new Date();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white px-4 sm:px-6 py-12 overflow-hidden relative">
      {/* SEO-friendly hidden heading */}
      <h1 className="sr-only">{`${user.name}'s Profile`}</h1>

      {/* Premium Background Effects */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,75,0,0.3),_transparent_70%)] pointer-events-none z-0"
        {...ANIMATION_VARIANTS.glowPulse}
      />
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(255,165,0,0.2),_transparent_60%)] pointer-events-none z-0"
        {...ANIMATION_VARIANTS.glowPulse}
        transition={{ ...ANIMATION_VARIANTS.glowPulse.transition, delay: 1 }}
      />
      <div className="absolute inset-0 bg-[url('/circuit-pattern.png')] opacity-10 pointer-events-none z-0" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.h1
          {...ANIMATION_VARIANTS.header}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-center uppercase tracking-wider bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent mb-10 sm:mb-14 drop-shadow-[0_0_15px_rgba(255,75,0,0.5)]"
        >
          {user.name}’s Arena
        </motion.h1>

        <motion.div variants={ANIMATION_VARIANTS.container} initial="hidden" animate="visible" className="space-y-8 sm:space-y-10">
          {/* User Header with Awards */}
          <motion.div
            variants={ANIMATION_VARIANTS.card}
            whileHover={ANIMATION_VARIANTS.card.hover}
            className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 p-6 sm:p-8 rounded-2xl border border-orange-700/40 backdrop-blur-lg shadow-[0_0_20px_rgba(255,75,0,0.2)] flex flex-col md:flex-row items-center gap-6 sm:gap-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2, type: "spring", stiffness: 150 }}
              className="w-28 h-28 sm:w-40 sm:h-40 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-orange-600/60 shadow-[0_0_25px_rgba(255,165,0,0.4)] relative"
            >
              <NextImage
                src={user.image || "/placeholder.png"}
                alt={`${user.name}'s avatar`}
                width={224}
                height={224}
                className="object-cover w-full h-full"
                loading="lazy"
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-orange-600/30 to-transparent pointer-events-none"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
            <div className="flex-1 text-center md:text-left">
              <motion.h2
                variants={ANIMATION_VARIANTS.item}
                className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent"
              >
                {user.name}
              </motion.h2>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-400 mt-2 sm:mt-3  font-semibold">
                Forging Greatness Since {new Date(user.createdAt).getFullYear()} {new Date(user.createdAt).toLocaleString("en-US", { month: "long" })}
              </p>
              <motion.p
                variants={ANIMATION_VARIANTS.item}
                className="text-lg sm:text-xl md:text-2xl text-gray-900 mt-2 font-medium bg-green-300 w-fit  py-1 px-6 rounded-xl capitalize"
              >
                {user.role}
              </motion.p>

             
              {user.awards.length > 0 && (
                <motion.div variants={ANIMATION_VARIANTS.item} className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                  {user.awards.map((award, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, rotate: -10 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * index, type: "spring" }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="flex items-center gap-2 bg-gradient-to-r from-gray-800/70 to-gray-700/70 p-2 rounded-lg border border-orange-600/30 shadow-inner"
                    >
                      <NextImage src={award} alt={`Award ${index + 1}`} width={28} height={28} className="object-contain" loading="lazy" />
                      <span className="text-sm sm:text-base text-white font-semibold">Trophy #{index + 1}</span>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* User Details */}
          <motion.div
            variants={ANIMATION_VARIANTS.card}
            whileHover={ANIMATION_VARIANTS.card.hover}
            className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 p-6 sm:p-8 rounded-2xl border border-orange-700/40 backdrop-blur-lg shadow-[0_0_20px_rgba(255,75,0,0.2)]"
          >
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent mb-6 flex items-center gap-3">
              <FaUser className="text-orange-500" /> Personal Stats
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <motion.div variants={ANIMATION_VARIANTS.item} className="flex items-start gap-3">
                <FaEnvelope className="text-orange-500 text-xl mt-1" />
                <div>
                  <p className="text-sm font-semibold text-gray-400">Email</p>
                  <p className="text-base sm:text-lg md:text-xl text-white">{user.email}</p>
                </div>
              </motion.div>
              {user.gender && (
                <motion.div variants={ANIMATION_VARIANTS.item} className="flex items-start gap-3">
                  <FaUser className="text-orange-500 text-xl mt-1" />
                  <div>
                    <p className="text-sm font-semibold text-gray-400">Gender</p>
                    <p className="text-base sm:text-lg md:text-xl text-white capitalize">{user.gender}</p>
                  </div>
                </motion.div>
              )}
              {user.phonenumber && (
                <motion.div variants={ANIMATION_VARIANTS.item} className="flex items-start gap-3">
                  <FaPhone className="text-orange-500 text-xl mt-1" />
                  <div>
                    <p className="text-sm font-semibold text-gray-400">Phone</p>
                    <p className="text-base sm:text-lg md:text-xl text-white">{user.phonenumber}</p>
                  </div>
                </motion.div>
              )}
              {user.Address && (
                <motion.div variants={ANIMATION_VARIANTS.item} className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-orange-500 text-xl mt-1" />
                  <div>
                    <p className="text-sm font-semibold text-gray-400">Address</p>
                    <p className="text-base sm:text-lg md:text-xl text-white">{user.Address}</p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Subscription Details */}
          {user.subscription && (
            <motion.div
              variants={ANIMATION_VARIANTS.card}
              whileHover={ANIMATION_VARIANTS.card.hover}
              className={`p-6 sm:p-8 rounded-2xl border border-orange-700/40 backdrop-blur-lg shadow-[0_0_20px_rgba(255,75,0,0.2)] ${
                isSubscriptionActive ? "bg-gradient-to-br from-green-900/90 to-green-800/90" : "bg-gradient-to-br from-gray-900/90 to-gray-800/90"
              }`}
            >
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent mb-6 flex items-center gap-3">
                <FaCrown className="text-orange-500" /> Membership Tier
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <motion.p variants={ANIMATION_VARIANTS.item} className="text-base sm:text-lg md:text-xl text-white flex items-start gap-2">
                  <span className="font-semibold text-orange-400">Plan:</span> {user.subscription.plan}
                </motion.p>
                <motion.p variants={ANIMATION_VARIANTS.item} className="text-base sm:text-lg md:text-xl text-white flex items-start gap-2">
                  <span className="font-semibold text-orange-400">Start:</span> {new Date(user.subscription.startDate).toLocaleDateString()}
                </motion.p>
                <motion.p variants={ANIMATION_VARIANTS.item} className="text-base sm:text-lg md:text-xl text-white flex items-start gap-2">
                  <span className="font-semibold text-orange-400">End:</span> {new Date(user.subscription.endDate).toLocaleDateString()}
                </motion.p>
                <motion.p variants={ANIMATION_VARIANTS.item} className="text-base sm:text-lg md:text-xl text-white flex items-start gap-2">
                  <span className="font-semibold text-orange-400">Price:</span> ${user.subscription.price}
                </motion.p>
              </div>
              <AnimatePresence>
                {isSubscriptionActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="mt-4 px-4 py-2 bg-green-600/30 text-green-300 text-sm sm:text-base font-semibold rounded-full inline-flex items-center gap-2"
                  >
                    <FaCrown className="text-green-400" /> Active Membership
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Fitness Stats */}
          <motion.div
            variants={ANIMATION_VARIANTS.card}
            whileHover={ANIMATION_VARIANTS.card.hover}
            className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 p-6 sm:p-8 rounded-2xl border border-orange-700/40 backdrop-blur-lg shadow-[0_0_20px_rgba(255,75,0,0.2)]"
          >
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent mb-6 flex items-center gap-3">
              <FaFire className="text-orange-500" /> Fitness Achievements
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <motion.div variants={ANIMATION_VARIANTS.item} className="flex items-start gap-3">
                <FaFire className="text-orange-500 text-xl mt-1" />
                <div>
                  <p className="text-sm font-semibold text-gray-400">Streak</p>
                  <p className="text-base sm:text-lg md:text-xl text-white font-bold flex items-center gap-2">
                    {user.streak} days
                    <motion.span {...ANIMATION_VARIANTS.streakGlow} className="text-orange-500">🔥</motion.span>
                  </p>
                </div>
              </motion.div>
              <motion.div variants={ANIMATION_VARIANTS.item} className="flex items-start gap-3">
                <FaAward className="text-orange-500 text-xl mt-1" />
                <div>
                  <p className="text-sm font-semibold text-gray-400">Points</p>
                  <p className="text-base sm:text-lg md:text-xl text-white">{user.points}</p>
                </div>
              </motion.div>
              <motion.div variants={ANIMATION_VARIANTS.item} className="flex items-start gap-3">
                <FaClock className="text-orange-500 text-xl mt-1" />
                <div>
                  <p className="text-sm font-semibold text-gray-400">Last Challenge</p>
                  <p className="text-base sm:text-lg md:text-xl text-white">
                    {user.lastChallengeDate ? new Date(user.lastChallengeDate).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Back Button */}
          <motion.button
            {...ANIMATION_VARIANTS.button}
            whileHover={ANIMATION_VARIANTS.button.hover}
            whileTap={ANIMATION_VARIANTS.button.tap}
            onClick={() => router.back()}
            className="mt-8 sm:mt-10 px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white text-base sm:text-lg md:text-xl font-semibold rounded-full transition-all duration-300 mx-auto flex items-center gap-2 shadow-[0_0_10px_rgba(255,75,0,0.3)]"
            aria-label="Go back"
          >
            <FaArrowLeft /> Back
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;