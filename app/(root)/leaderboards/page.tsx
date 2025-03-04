"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaTrophy, FaCrown, FaFire } from "react-icons/fa";

// Type Definition
interface IUser {
  _id: string;
  name: string;
  image?: string;
  points: number;
  streak: number;
  awards: string[];
}

// Constants
const ANIMATION_VARIANTS = {
  header: { initial: { opacity: 0, y: -100 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1.2, ease: "easeOut", type: "spring", stiffness: 120 } },
  podium: { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 1.2, delay: 0.4, type: "spring", stiffness: 100 } },
  list: { initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1, delay: 0.6, type: "spring", stiffness: 80 } },
  item: (index: number) => ({ initial: { opacity: 0, x: -50 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.6, delay: 0.1 * index + 0.6 } }),
};

const PODIUM_POSITIONS = [1, 0, 2]; // Second, First, Third

const LeaderboardPage: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Leaderboard Data
  const fetchLeaderboard = useCallback(async () => {
    try {
      const response = await fetch("/api/users/leaderboard", { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to fetch leaderboard");
      const data = await response.json();
      if (data.success) {
        const sortedUsers = data.users.sort((a: IUser, b: IUser) => b.points - a.points);
        setUsers(sortedUsers);
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  // Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.3, 1], borderColor: ["#ff0000", "#ff4500", "#ff0000"] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-24 h-24 border-8 border-t-red-600 border-red-900/50 rounded-full shadow-[0_0_30px_rgba(255,0,0,0.8)] relative"
        >
          <FaTrophy className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-yellow-400 text-4xl" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-8 sm:py-16 overflow-hidden relative">
      {/* SEO-friendly hidden heading */}
      <h1 className="sr-only">Leaderboard - Hall of Legends</h1>

      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,0,0,0.4),_transparent_50%)] pointer-events-none opacity-80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(255,69,0,0.4),_transparent_50%)] pointer-events-none opacity-80" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_rgba(255,0,0,0.7)]"
            initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, opacity: 0.6 }}
            animate={{ y: [null, -150 - Math.random() * 200], opacity: [0.6, 1, 0], scale: [1, 1.5, 1] }}
            transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, ease: "easeOut", delay: Math.random() * 3 }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.header {...ANIMATION_VARIANTS.header} className="text-4xl sm:text-6xl md:text-8xl font-extrabold text-center mb-12 sm:mb-20 tracking-tighter uppercase relative z-10">
        <motion.span
          animate={{ scale: [1, 1.05, 1], textShadow: ["0 0 10px rgba(255,0,0,0.5)", "0 0 20px rgba(255,69,0,0.8)", "0 0 10px rgba(255,0,0,0.5)"] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="bg-gradient-to-r from-red-600 via-orange-500 to-red-600 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(255,0,0,0.9)]"
        >
          Hall of Legends
        </motion.span>
        <motion.div
          className="absolute -bottom-4 sm:-bottom-6 left-1/2 transform -translate-x-1/2 h-1 w-3/4 sm:w-1/2 bg-gradient-to-r from-red-600 via-orange-500 to-red-600 rounded-full shadow-[0_0_15px_rgba(255,0,0,0.7)]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
        />
      </motion.header>

      {/* Podium for Top 3 */}
      <motion.section {...ANIMATION_VARIANTS.podium} className="flex flex-col sm:flex-row justify-center items-end gap-4 sm:gap-8 mb-12 sm:mb-16 relative z-10 px-4">
        {PODIUM_POSITIONS.map((position) => {
          const user = users[position];
          if (!user) return null;
          const isTop = position === 0;
          const podiumHeight = isTop ? "h-36 sm:h-48" : position === 1 ? "h-28 sm:h-36" : "h-20 sm:h-24";
          const podiumColor = isTop ? "bg-gradient-to-b from-red-600 to-red-900" : position === 1 ? "bg-gradient-to-b from-orange-500 to-orange-800" : "bg-gradient-to-b from-yellow-600 to-yellow-900";
          const rankIcon = isTop ? (
            <motion.div
              animate={{ y: [-5, 5, -5], rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="absolute -top-12 sm:-top-14 left-1/2 transform -translate-x-1/2"
            >
              <FaCrown className="text-yellow-400 text-3xl sm:text-4xl drop-shadow-[0_0_15px_rgba(255,165,0,0.9)]" />
            </motion.div>
          ) : (
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="absolute -top-8 sm:-top-10 left-1/2 transform -translate-x-1/2 text-2xl sm:text-3xl font-bold text-white drop-shadow-[0_0_8px_rgba(255,0,0,0.8)]"
            >
              {position + 1}
            </motion.span>
          );

          return (
            <motion.div
              key={user._id}
              whileHover={{ scale: 1.1, y: -10, boxShadow: "0 0 30px rgba(255,0,0,0.8)" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex flex-col items-center w-full sm:w-36"
            >
              <div className="relative mb-2 sm:mb-5">
                {rankIcon}
                <Image
                  src={user.image || "/default-avatar.png"}
                  alt={`${user.name}'s avatar`}
                  width={isTop ? 100 : 80}
                  height={isTop ? 100 : 80}
                  className="rounded-full border-4 border-red-600 shadow-[0_0_20px_rgba(255,0,0,0.7)] object-cover w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24"
                  loading="lazy"
                />
              </div>
              <div className={`w-32 sm:w-36 ${podiumHeight} ${podiumColor} rounded-t-lg shadow-[0_0_25px_rgba(255,0,0,0.6)] flex flex-col justify-end items-center pb-4`}>
                <p className="text-base sm:text-xl font-bold text-white uppercase tracking-wide truncate w-full text-center">{user.name}</p>
                <p className="text-lg sm:text-2xl font-extrabold text-yellow-400">{user.points} PTS</p>
                <p className="text-xs sm:text-sm text-gray-300 flex items-center gap-1">
                  <FaFire className="text-orange-500" /> {user.streak}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.section>

      {/* Leaderboard List */}
      <section className="max-w-full sm:max-w-4xl mx-auto px-4 sm:px-0 relative z-10">
        <motion.div {...ANIMATION_VARIANTS.list} className="bg-gradient-to-br from-gray-950 to-gray-900 border-2 border-red-900/60 rounded-3xl shadow-[0_0_50px_rgba(255,0,0,0.5)] overflow-hidden">
          <div className="p-4 sm:p-8">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-center mb-6 sm:mb-8 uppercase tracking-wider text-white drop-shadow-[0_0_15px_rgba(255,0,0,0.6)]">
              Warriors of Valor
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {users.slice(3).map((user, index) => (
                <motion.div
                  key={user._id}
                  {...ANIMATION_VARIANTS.item(index)}
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 69, 0, 0.15)", boxShadow: "0 0 20px rgba(255,0,0,0.5)" }}
                  className="flex items-center gap-4 sm:gap-6 p-3 sm:p-4 bg-[rgba(20,20,20,0.9)] rounded-xl border border-red-800/50 shadow-[0_0_15px_rgba(255,0,0,0.3)]"
                >
                  <motion.span
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut", delay: 0.2 * index }}
                    className="text-xl sm:text-2xl font-bold text-red-500 w-8 sm:w-12 text-center"
                  >
                    {index + 4}
                  </motion.span>
                  <Image
                    src={user.image || "/placeholder.png"}
                    alt={`${user.name}'s avatar`}
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-red-600 shadow-[0_0_10px_rgba(255,0,0,0.5)] w-10 h-10 sm:w-12 sm:h-12"
                    loading="lazy"
                  />
                  <div className="flex-1 truncate">
                    <p className="text-base sm:text-xl font-semibold text-white uppercase tracking-wide truncate">{user.name}</p>
                    <p className="text-xs sm:text-sm text-gray-400 flex items-center gap-1">
                      <FaFire className="text-orange-500" /> {user.streak}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.div animate={{ y: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}>
                      <FaTrophy className="text-yellow-400 text-lg sm:text-xl" />
                    </motion.div>
                    <p className="text-lg sm:text-2xl font-extrabold text-yellow-400">{user.points} PTS</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default LeaderboardPage;