"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaUsers, FaBoxOpen, FaDollarSign, FaTrash, FaGift, FaBell, FaSearch } from "react-icons/fa"; // Added FaSearch
import axios from "axios";
import { useSession } from "next-auth/react";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";
import NextImage from "next/image";
import Link from "next/link";

interface User {
    _id: string;
    name: string;
    email: string;
    role: "admin" | "user" | "trainer";
    image?: string;
    subscription?: {
        planName: string;
        startDate: string;
        endDate: string;
        price: number;
        qrCode: string;
    };
}

interface DashboardData {
    totalUsers: number;
    productsSold: number;
    totalRevenue: number;
    users: User[];
}

const AdminDashboard = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [data, setData] = useState<DashboardData>({
        totalUsers: 0,
        productsSold: 0,
        totalRevenue: 0,
        users: [],
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState(""); // New state for search input

    useEffect(() => {
        if (status === "loading" || !session?.user?.id) return;

        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const response = await axios.get("/api/admin/dashboard");
                const result = response.data;
                if (result.success) {
                    console.log("Fetched Users:", result.users);
                    setData({
                        totalUsers: result.totalUsers || 0,
                        productsSold: result.productsSold || 0,
                        totalRevenue: result.totalRevenue || 0,
                        users: result.users || [],
                    });
                } else {
                    setError(result.message || "Failed to fetch dashboard data");
                }
            } catch (err) {
                setError("An error occurred while fetching data");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [session, status]);

    const handleDeleteUser = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return;

        try {
            const response = await axios.delete(`/api/admin/users/${userId}`);
            if (response.data.success) {
                setData((prev) => ({
                    ...prev,
                    totalUsers: prev.totalUsers - 1,
                    users: prev.users.filter((user) => user._id !== userId),
                }));
            } else {
                alert("Failed to delete user");
            }
        } catch (err) {
            alert("An error occurred while deleting the user");
            console.error(err);
        }
    };

    const handleGrantMembership = async (userId: string) => {
        if (!confirm("Are you sure you want to grant a free membership to this user?")) return;

        try {
            const response = await axios.post(`/api/admin/grant-membership`, { userId });
            if (response.data.success) {
                setData((prev) => ({
                    ...prev,
                    users: prev.users.map((user) =>
                        user._id === userId ? { ...user, subscription: response.data.subscription } : user
                    ),
                }));
                alert("Free membership granted successfully!");
            } else {
                alert("Failed to grant membership");
            }
        } catch (err) {
            alert("An error occurred while granting the membership");
            console.error(err);
        }
    };

    const handleSendNotification = async () => {
        if (!notificationMessage.trim()) {
            alert("Please enter a notification message.");
            return;
        }

        try {
            const response = await axios.post("/api/admin/send-notification", {
                message: notificationMessage,
            });
            if (response.data.success) {
                alert("Notification sent to all users' emails successfully!");
                setNotificationMessage("");
                setIsModalOpen(false);
            } else {
                alert("Failed to send notification: " + response.data.message);
            }
        } catch (err) {
            alert("An error occurred while sending the notification");
            console.error(err);
        }
    };

    const handleUserClick = (userId: string) => {
        router.push(`/profile/${userId}`);
    };

    const hasMembership = (subscription?: User["subscription"]) => {
        const result = !!subscription;
        console.log("hasMembership - Subscription:", subscription, "Result:", result);
        return result;
    };

    // Filter users based on search query
    const filteredUsers = data.users.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen bg-black flex justify-center items-center">
                <Loading />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black flex justify-center items-center text-red-500 text-xl font-semibold">
                {error}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white px-8 py-16 overflow-hidden relative">
            <motion.div
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,0,0,0.2),_transparent_70%)] pointer-events-none"
                animate={{ opacity: [0.5, 0.7, 0.5] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="absolute inset-0 bg-[url('/gym-texture.png')] opacity-15 pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-20">
                <motion.h1
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-4xl md:text-6xl font-extrabold text-center uppercase tracking-tight text-white mb-12 drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]"
                >
                    Admin <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">Control Hub</span>
                </motion.h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-3xl border-2 border-red-900/50 shadow-[0_0_15px_rgba(255,0,0,0.3)] hover:shadow-[0_0_25px_rgba(255,165,0,0.5)] transition-all duration-300"
                    >
                        <div className="flex items-center gap-4">
                            <FaUsers className="text-orange-500 text-4xl" />
                            <div>
                                <h2 className="text-xl font-bold text-gray-300 uppercase">Total Users</h2>
                                <p className="text-3xl md:text-4xl font-extrabold text-white mt-2">{data.totalUsers}</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                        className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-3xl border-2 border-red-900/50 shadow-[0_0_15px_rgba(255,0,0,0.3)] hover:shadow-[0_0_25px_rgba(255,165,0,0.5)] transition-all duration-300"
                    >
                        <div className="flex items-center gap-4">
                            <FaBoxOpen className="text-orange-500 text-4xl" />
                            <div>
                                <h2 className="text-xl font-bold text-gray-300 uppercase">Products Sold</h2>
                                <p className="text-3xl md:text-4xl font-extrabold text-white mt-2">{data.productsSold}</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                        className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-3xl border-2 border-red-900/50 shadow-[0_0_15px_rgba(255,0,0,0.3)] hover:shadow-[0_0_25px_rgba(255,165,0,0.5)] transition-all duration-300"
                    >
                        <div className="flex items-center gap-4">
                            <FaDollarSign className="text-orange-500 text-4xl" />
                            <div>
                                <h2 className="text-xl font-bold text-gray-300 uppercase">Total Revenue</h2>
                                <p className="text-3xl md:text-4xl font-extrabold text-white mt-2">${data.totalRevenue.toFixed(2)}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Send Notification Button */}
                <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255,165,0,0.6)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(true)}
                    className="mb-8 absolute top-0 right-0 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white text-lg font-semibold rounded-full shadow-[0_0_10px_rgba(255,0,0,0.4)] hover:from-red-700 hover:to-orange-700 transition-all duration-300 flex items-center gap-2 mx-auto"
                >
                    <FaBell /> Send Notification
                </motion.button>

                {/* Notification Modal */}
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.8, y: 50 }}
                            className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-3xl border-2 border-red-900/50 shadow-[0_0_20px_rgba(255,0,0,0.5)] w-full max-w-md"
                        >
                            <h3 className="text-2xl font-extrabold text-white uppercase tracking-wide mb-4 flex items-center gap-2">
                                <FaBell className="text-orange-500" /> Send Notification
                            </h3>
                            <textarea
                                value={notificationMessage}
                                onChange={(e) => setNotificationMessage(e.target.value)}
                                placeholder="Enter your notification message here..."
                                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-orange-500 mb-4"
                                rows={4}
                            />
                            <div className="flex gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSendNotification}
                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold rounded-full shadow-[0_0_10px_rgba(255,0,0,0.4)] hover:from-red-700 hover:to-orange-700 transition-all duration-300"
                                >
                                    Send
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 bg-gray-600 text-white font-semibold rounded-full hover:bg-gray-700 transition-all duration-300"
                                >
                                    Cancel
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* User Management with Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
                    className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-3xl border-2 border-red-900/50 shadow-[0_0_15px_rgba(255,0,0,0.3)]"
                >
                    <div className="flex items-center justify-between">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-wide mb-6">
                        User Management
                    </h2>
                   <Link href={"/admin/orders"}>
                   <button className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold rounded-full shadow-[0_0_10px_rgba(255,0,0,0.4)] hover:from-red-700 hover:to-orange-700 transition-all duration-300">
                            Orders ➩
                    </button>
                   </Link>
                    </div>
                    {/* Search Bar */}
                    <div className="mb-6 flex items-center gap-3">
                        <FaSearch className="text-gray-400 text-xl" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search users by name..."
                            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-orange-500 transition-all duration-300"
                        />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-gray-400 font-bold uppercase border-b border-gray-700">
                                    <th className="py-3 px-4">Image</th>
                                    <th className="py-3 px-4">Name</th>
                                    <th className="py-3 px-4">Email</th>
                                    <th className="py-3 px-4">Role</th>
                                    <th className="py-3 px-4">Membership</th>
                                    <th className="py-3 px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <motion.tr
                                        key={user._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5 }}
                                        className="border-b border-gray-800 hover:bg-gray-700/50 transition-all duration-300"
                                    >
                                        <td className="py-3 px-4">
                                            <motion.div
                                                whileHover={{ scale: 1.1 }}
                                                className="w-10 h-10 rounded-full overflow-hidden cursor-pointer"
                                                onClick={() => handleUserClick(user._id)}
                                            >
                                                <NextImage
                                                    src={user.image || "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAqAMBIgACEQEDEQH/xAAbAAEBAAMBAQEAAAAAAAAAAAAAAQIDBQQGB//EADQQAAIBAwIDBQcBCQAAAAAAAAABAgMEESExEkFRBSIyYZETFDRScXKBQhUjJDNigqHB8P/EABUBAQEAAAAAAAAAAAAAAAAAAAAB/8QAFhEBAQEAAAAAAAAAAAAAAAAAABEB/9oADAMBAAIRAxEAPwD9cABUAAAAAAAAADXUuaFPx1YJ9MgbAeb3+1zj2y9GbIXNCp4K0H+QNoAAABsCMgIAIwyMACADcAAAAAAAAee8u6dssNp1HtHmL26VtSUlrOWkUcKUnJuUnxN7t8wN1xeV67xKbUPlR5wCwNOgAEHot7yvQeIyzH5Zao69rd07ld3uzW8XyOAVScGpQlwyWzRB9NkxPPZXSuqedpx8Uf8AZvAEKyARkBAGSBgD0AAAAAABpvZ+ztKslo+FrIHFva7r3EpZ7qeIo0AFAAAAAAI2UxYG+zruhcRl+l6S+h32fMPY+gs5upa0pPxcKTfUg3GLKyMAY5DZGwIwRsAesAAAAAPJ2p8FL7kes0X8OO0qros+gHz4AKAAAAEyAZAQAdrsz4OH3M4jO9Yx4LWmnvw59Ro3kYbMWyAzENkYEBGAPcAAAAABpNYezAA+euqLoV503tnTzRpO52hae8U1KC/eR2810OI1jfcCAEKDZAwBAGEm2lhvUDZbUXcVo01s3q/I7+2iPJYW3u8HKX8yW/l5HqZAyYZKRsCZMWytkYEbIRsoHQAAAAAAAAPHfWMLhuUXw1OvKR7DzV763ovEqnE+kdQOLWo1aMsVYOL/AMGrkd+ldW9wuFSg8/pluYVLC2nr7NRf9LwKOER/U7P7ModZ+pnTsLanr7Pi+ryKONRo1K7xSi31fQ61nYwt+9J8VTryX0Nla6oUFiU4rG0I7+iMaN7b1dFNRfSWgG9sxZd9caGLYBmLYbIBGRsNmLYBsGLAHUAAAAADRdXdO2j3u9LlFbkvbqNtTysOcvCjgznKpNzm8yb1YG+5vK1xvLhh8iPM9NgRlAzhXrQWIVZxXkzWAN7vbrGPbSNU69afjqzl9WYEAEYIBvt7urRlhSco/K9jqW11TuI914kt09zhiM5QkpReGtmB9C9jFmizuVcU8tYmt0bm8kEZi2XOpiwI2CADrgAASTUYtt4S3KeLtarwW3At5vH45gcq6ryuK0qjem0fJGomSMoZIAAICAGRgjAEYI2BMkBGBsoVnQrKpyW66o7ikmk09HsfOs6vZ1Xjt+F7wePwQetsxepWyARghQOwAABx+2Z5rwhyUc/96HYbOH2s/wCMf2oDxsxKQoEAAGJTFsA2QEYB7GLK2YgG9CAjYEZ7Oy54rShycc+h4mz09mfFL7WQddmLZWzEAUgA7QYAGJxO1vjH9qAA8QAKIRgAQxAAGLKAMSMADEx5gAGejs34r+1gEHWZAAIAAP/Z"}
                                                    alt={user.name}
                                                    width={40}
                                                    height={40}
                                                    className="object-cover w-full h-full"
                                                />
                                            </motion.div>
                                        </td>
                                        <td className="py-3 px-4 text-gray-300">
                                            <span
                                                className="cursor-pointer hover:text-orange-500 transition-colors duration-300"
                                                onClick={() => handleUserClick(user._id)}
                                            >
                                                {user.name}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-gray-300">{user.email}</td>
                                        <td className="py-3 px-4">
                                            <span
                                                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                                                    user.role === "admin"
                                                        ? "bg-green-600"
                                                        : user.role === "trainer"
                                                        ? "bg-blue-600"
                                                        : "bg-gray-600"
                                                }`}
                                            >
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <motion.span
                                                key={`${user._id}-${hasMembership(user.subscription)}`}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.3 }}
                                                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                                                    hasMembership(user.subscription)
                                                        ? "bg-green-600 text-white shadow-[0_0_8px_rgba(0,255,0,0.5)]"
                                                        : "bg-gray-600 text-gray-300 shadow-[0_0_8px_rgba(255,0,0,0.3)]"
                                                }`}
                                            >
                                                {hasMembership(user.subscription) ? (
                                                    <span className="flex items-center gap-1">
                                                        <span className="animate-pulse">⚡</span> Active
                                                    </span>
                                                ) : (
                                                    "Inactive"
                                                )}
                                            </motion.span>
                                        </td>
                                        <td className="py-3 px-4 flex gap-2">
                                            {user.role !== "admin" && (
                                                <>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1, boxShadow: "0 0 10px rgba(255,0,0,0.6)" }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleDeleteUser(user._id)}
                                                        className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-300"
                                                    >
                                                        <FaTrash size={16} />
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1, boxShadow: "0 0 10px rgba(0,255,0,0.6)" }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleGrantMembership(user._id)}
                                                        className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all duration-300"
                                                        disabled={hasMembership(user.subscription)}
                                                    >
                                                        <FaGift size={16} />
                                                    </motion.button>
                                                </>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>

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
        </div>
    );
};

export default AdminDashboard;