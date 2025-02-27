"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import axios from "axios";
import NextImage from "next/image";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCrown, FaFire, FaAward, FaClock } from "react-icons/fa";
import Loading from "@/components/Loading";
import Image from "next/image";

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
        planName: string;
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
}

const ProfilePage = ({ params }: { params: { userId: string } }) => {
    const router = useRouter();
    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const unwrappedParams = React.use(params);
    const { userId } = unwrappedParams;

    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/users/${userId}`);
                if (response.data.success) {
                    setUser(response.data.user);
                } else {
                    setError(response.data.message || "Failed to fetch user profile");
                }
            } catch (err) {
                setError("An error occurred while fetching the profile");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [userId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex justify-center items-center">
                <Loading />
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex justify-center items-center text-red-400 text-2xl font-bold tracking-wide">
                {error || "User not found"}
            </div>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5, type: "spring", stiffness: 120 } },
    };

    const cardVariants = {
        hover: { scale: 1.03, boxShadow: "0 0 30px rgba(255, 75, 0, 0.5)" },
    };

    // Check if subscription is active
    const isSubscriptionActive = user.subscription && new Date(user.subscription.endDate) > new Date();

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white px-6 py-12 overflow-hidden relative">
            {/* Dynamic Background */}
            <motion.div
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,75,0,0.2),_transparent_70%)] pointer-events-none"
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="absolute inset-0 bg-[url('/circuit-pattern.png')] opacity-5 pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <motion.h1
                    initial={{ opacity: 0, y: -60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    className="text-4xl md:text-6xl font-extrabold text-center uppercase tracking-wider bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-14 drop-shadow-[0_0_25px_rgba(255,75,0,0.6)]"
                >
                    {user.name}’s Profile
                </motion.h1>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-10"
                >
                    {/* User Header with Awards */}
                    <motion.div
                        variants={cardVariants}
                        whileHover="hover"
                        className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 p-8 rounded-3xl shadow-[0_0_25px_rgba(255,75,0,0.3)] border border-red-700/30 backdrop-blur-md flex flex-col md:flex-row items-center gap-6"
                    >
                        <motion.div
                            initial={{ opacity: 0, rotate: -10 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            transition={{ duration: 0.7, delay: 0.2, type: "spring" }}
                            className="w-36 h-36 md:w-52 md:h-52 rounded-full overflow-hidden shadow-[0_0_30px_rgba(255,75,0,0.5)] border-4 border-orange-600/50"
                        >
                            <NextImage
                                src={user.image || "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAqAMBIgACEQEDEQH/xAAbAAEBAAMBAQEAAAAAAAAAAAAAAQIDBQQGB//EADQQAAIBAwIDBQcBCQAAAAAAAAABAgMEESExEkFRBSIyYZETFDRScXKBQhUjJDNigqHB8P/EABUBAQEAAAAAAAAAAAAAAAAAAAAB/8QAFhEBAQEAAAAAAAAAAAAAAAAAABEB/9oADAMBAAIRAxEAPwD9cABUAAAAAAAAADXUuaFPx1YJ9MgbAeb3+1zj2y9GbIXNCp4K0H+QNoAAABsCMgIAIwyMACADcAAAAAAAAee8u6dssNp1HtHmL26VtSUlrOWkUcKUnJuUnxN7t8wN1xeV67xKbUPlR5wCwNOgAEHot7yvQeIyzH5Zao69rd07ld3uzW8XyOAVScGpQlwyWzRB9NkxPPZXSuqedpx8Uf8AZvAEKyARkBAGSBgD0AAAAAABpvZ+ztKslo+FrIHFva7r3EpZ7qeIo0AFAAAAAAI2UxYG+zruhcRl+l6S+h32fMPY+gs5upa0pPxcKTfUg3GLKyMAY5DZGwIwRsAesAAAAAPJ2p8FL7kes0X8OO0qros+gHz4AKAAAAEyAZAQAdrsz4OH3M4jO9Yx4LWmnvw59Ro3kYbMWyAzENkYEBGAPcAAAAABpNYezAA+euqLoV503tnTzRpO52hae8U1KC/eR2810OI1jfcCAEKDZAwBAGEm2lhvUDZbUXcVo01s3q/I7+2iPJYW3u8HKX8yW/l5HqZAyYZKRsCZMWytkYEbIRsoHQAAAAAAAAPHfWMLhuUXw1OvKR7DzV763ovEqnE+kdQOLWo1aMsVYOL/AMGrkd+ldW9wuFSg8/pluYVLC2nr7NRf9LwKOER/U7P7ModZ+pnTsLanr7Pi+ryKONRo1K7xSi31fQ61nYwt+9J8VTryX0Nla6oUFiU4rG0I7+iMaN7b1dFNRfSWgG9sxZd9caGLYBmLYbIBGRsNmLYBsGLAHUAAAAADRdXdO2j3u9LlFbkvbqNtTysOcvCjgznKpNzm8yb1YG+5vK1xvLhh8iPM9NgRlAzhXrQWIVZxXkzWAN7vbrGPbSNU69afjqzl9WYEAEYIBvt7urRlhSco/K9jqW11TuI914kt09zhiM5QkpReGtmB9C9jFmizuVcU8tYmt0bm8kEZi2XOpiwI2CADrgAASTUYtt4S3KeLtarwW3At5vH45gcq6ryuK0qjem0fJGomSMoZIAAICAGRgjAEYI2BMkBGBsoVnQrKpyW66o7ikmk09HsfOs6vZ1Xjt+F7wePwQetsxepWyARghQOwAABx+2Z5rwhyUc/96HYbOH2s/wCMf2oDxsxKQoEAAGJTFsA2QEYB7GLK2YgG9CAjYEZ7Oy54rShycc+h4mz09mfFL7WQddmLZWzEAUgA7QYAGJxO1vjH9qAA8QAKIRgAQxAAGLKAMSMADEx5gAGejs34r+1gEHWZAAIAAP/Z"}
                                alt={user.name}
                                width={208}
                                height={208}
                                className="object-cover w-full h-full"
                            />
                        </motion.div>
                        <div className="flex-1 text-center md:text-left">
                            <motion.h2
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent"
                            >
                                {user.name}
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="text-lg md:text-xl text-gray-200 mt-2 font-medium"
                            >
                                {user.role}
                            </motion.p>
                            {/* Awards Below Name */}
                            {user.awards.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.5 }}
                                    className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start"
                                >
                                    {user.awards.map((award, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                                            className="flex items-center gap-2 bg-gray-800/50 p-2 rounded-lg shadow-inner"
                                        >
                                            <Image
                                                src={award}
                                                alt={`Award ${index + 1}`}
                                                width={24}
                                                height={24}
                                                className="object-contain"
                                            />
                                            <span className="text-sm text-white">Award #{index + 1}</span>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </div>
                    </motion.div>

                    {/* User Details */}
                    <motion.div
                        variants={cardVariants}
                        whileHover="hover"
                        className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 p-8 rounded-3xl shadow-[0_0_25px_rgba(255,75,0,0.3)] border border-red-700/30 backdrop-blur-md"
                    >
                        <h3 className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-6 flex items-center gap-3">
                            <FaUser className="text-orange-500" /> Personal Info
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
                                <p className="text-sm font-semibold text-gray-300">Email</p>
                                <p className="text-lg md:text-xl text-white mt-1 flex items-center gap-2">
                                    <FaEnvelope className="text-orange-500" /> {user.email}
                                </p>
                            </motion.div>
                            {user.gender && (
                                <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.4 }}>
                                    <p className="text-sm font-semibold text-gray-300">Gender</p>
                                    <p className="text-lg md:text-xl text-white mt-1 flex items-center gap-2">
                                        <FaUser className="text-orange-500" /> {user.gender}
                                    </p>
                                </motion.div>
                            )}
                            {user.phonenumber && (
                                <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.5 }}>
                                    <p className="text-sm font-semibold text-gray-300">Phone</p>
                                    <p className="text-lg md:text-xl text-white mt-1 flex items-center gap-2">
                                        <FaPhone className="text-orange-500" /> {user.phonenumber}
                                    </p>
                                </motion.div>
                            )}
                            {user.Address && (
                                <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.6 }}>
                                    <p className="text-sm font-semibold text-gray-300">Address</p>
                                    <p className="text-lg md:text-xl text-white mt-1 flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-orange-500" /> {user.Address}
                                    </p>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>

                    {/* Subscription Details */}
                    {user.subscription && (
                        <motion.div
                            variants={cardVariants}
                            whileHover="hover"
                            className={`p-8 rounded-3xl shadow-[0_0_25px_rgba(255,75,0,0.3)] border border-red-700/30 backdrop-blur-md ${
                                isSubscriptionActive
                                    ? "bg-gradient-to-br from-green-900/80 to-green-800/80"
                                    : "bg-gradient-to-br from-gray-900/80 to-gray-800/80"
                            }`}
                        >
                            <h3 className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-6 flex items-center gap-3">
                                <FaCrown className="text-orange-500" /> Subscription
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <motion.p variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.7 }} className="text-lg text-white">
                                    <span className="font-semibold text-orange-400">Plan:</span> {user.subscription.planName}
                                </motion.p>
                                <motion.p variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.8 }} className="text-lg text-white">
                                    <span className="font-semibold text-orange-400">Start:</span>{" "}
                                    {new Date(user.subscription.startDate).toLocaleDateString()}
                                </motion.p>
                                <motion.p variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.9 }} className="text-lg text-white">
                                    <span className="font-semibold text-orange-400">End:</span>{" "}
                                    {new Date(user.subscription.endDate).toLocaleDateString()}
                                </motion.p>
                                <motion.p variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 1.0 }} className="text-lg text-white">
                                    <span className="font-semibold text-orange-400">Price:</span> ${user.subscription.price}
                                </motion.p>
                            </div>
                            {isSubscriptionActive && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 1.1 }}
                                    className="mt-4 px-4 py-2 bg-green-500/20 text-green-300 text-sm font-semibold rounded-full inline-block"
                                >
                                    Active Subscription
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {/* Fitness Stats */}
                    <motion.div
                        variants={cardVariants}
                        whileHover="hover"
                        className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 p-8 rounded-3xl shadow-[0_0_25px_rgba(255,75,0,0.3)] border border-red-700/30 backdrop-blur-md"
                    >
                        <h3 className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-6 flex items-center gap-3">
                            <FaFire className="text-orange-500" /> Fitness Stats
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 1.2 }}>
                                <p className="text-sm font-semibold text-gray-300">Streak</p>
                                <p className="text-lg md:text-xl text-white mt-1 flex items-center gap-2">
                                    <FaFire className="text-orange-500" /> {user.streak} days
                                </p>
                            </motion.div>
                            <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 1.3 }}>
                                <p className="text-sm font-semibold text-gray-300">Points</p>
                                <p className="text-lg md:text-xl text-white mt-1 flex items-center gap-2">
                                    <FaAward className="text-orange-500" /> {user.points}
                                </p>
                            </motion.div>
                            <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 1.4 }}>
                                <p className="text-sm font-semibold text-gray-300">Last Challenge</p>
                                <p className="text-lg md:text-xl text-white mt-1 flex items-center gap-2">
                                    <FaClock className="text-orange-500" /> {user.lastChallengeDate || "N/A"}
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Back Button */}
                    <motion.button
                        whileHover={{ scale: 1.1, boxShadow: "0 0 30px rgba(255,75,0,0.6)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.back()}
                        className="mt-10 px-10 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white text-lg md:text-xl font-semibold rounded-full shadow-[0_0_20px_rgba(255,75,0,0.4)] hover:from-red-700 hover:to-orange-700 transition-all duration-300 mx-auto block"
                    >
                        Back
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
};

export default ProfilePage;