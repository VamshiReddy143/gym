"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { FaHome, FaCog, FaBoxOpen, FaDollarSign, FaEnvelope, FaBell, FaTrash, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import gymlogo from "@/public/gymlogo.jpg";
import Gymmy from "./Gymmy";
import AddButton from "./AddButton";
import { DropdownMenuDemo } from "./DropdownMenu";
import { useSession, signOut } from "next-auth/react";
import placeholder from "@/public/placeholder.png";


interface NavLink {
    name: string;
    path: string;
    icon: React.ElementType;
}

interface NotificationItem {
    _id: string;
    message: string;
    createdAt: string;
}

const Navbar: React.FC = () => {
    const pathname = usePathname();
    const { data: session, status } = useSession(); // Get session data
    const [showChatbot, setShowChatbot] = useState(false);
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isActive = (route: string): boolean => pathname === route;

    const navLinks: NavLink[] = [
        { name: "HOME", path: "/", icon: FaHome },
        { name: "SERVICES", path: "/#services", icon: FaCog },
        { name: "PRODUCTS", path: "/products", icon: FaBoxOpen },
        { name: "SUBSCRIPTIONS", path: "/#billing", icon: FaDollarSign },
        { name: "CONTACT", path: "/contact", icon: FaEnvelope },
    ];

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch("/api/notifications", { credentials: "include" });
                const data = await response.json();
                if (data.success) {
                    setNotifications(data.notifications);
                }
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleDeleteNotification = async (notificationId: string) => {
        try {
            const response = await fetch(`/api/notifications/delete`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: notificationId }),
                credentials: "include",
            });
            const data = await response.json();
            if (data.success) {
                setNotifications((prev) => prev.filter((notif) => notif._id !== notificationId));
            } else {
                console.error("Failed to delete notification:", data.message);
            }
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    };

    return (
        <nav className="bg-black text-white relative z-50">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="fixed top-0 left-0 right-0 flex items-center justify-between p-2 sm:p-4 bg-gradient-to-r from-gray-950 to-gray-900 shadow-[0_0_20px_rgba(255,0,0,0.3)] z-50"
            >
                {/* Logo & Brand */}
                <div className="flex items-center gap-2 sm:gap-3">
                    <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 200 }}>
                        <Image
                            src={gymlogo}
                            alt="Gym Logo"
                            width={36}
                            height={36}
                            className="object-contain rounded-full shadow-[0_0_10px_rgba(255,165,0,0.5)]"
                        />
                    </motion.div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold uppercase tracking-wide">
                        FITN<span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">ASE</span>
                    </h1>
                </div>

                {/* Desktop Nav Links */}
                <ul className="hidden md:flex items-center space-x-4 lg:space-x-6 xl:space-x-8 flex-1 justify-center">
                    {navLinks.map(({ name, path }) => (
                        <li key={path} className="flex-shrink-0">
                            <Link href={path}>
                                <motion.span
                                    whileHover={{ scale: 1.1, color: "#f97316" }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`text-sm md:text-base lg:text-[15px] font-semibold uppercase tracking-wide transition-colors duration-300 whitespace-nowrap ${
                                        isActive(path)
                                            ? "text-orange-500 border-b-2 border-orange-500"
                                            : "text-gray-300 hover:text-orange-500"
                                    }`}
                                >
                                    {name}
                                </motion.span>
                            </Link>
                        </li>
                    ))}
                    <motion.div whileHover={{ scale: 1.05 }} className="flex-shrink-0">
                        <DropdownMenuDemo />
                    </motion.div>
                </ul>
             

                {/* Right Section */}
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6">
                    <Link href="/admin/addproduct">
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <AddButton />
                        </motion.div>
                    </Link>
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255,165,0,0.6)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowChatbot((prev) => !prev)}
                        className="hidden md:flex border-2 border-red-600 text-white p-1 sm:px-1 sm:py-2 md:px-3 md:py-1 rounded-full bg-gradient-to-r from-red-600/20 to-orange-600/20 hover:from-red-600/30 hover:to-orange-600/30 transition-all duration-300 text-sm md:text-base lg:text-lg font-bold uppercase tracking-wide"
                    >
                        ✨ AI
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowChatbot((prev) => !prev)}
                        className="md:hidden border-2 border-red-600 text-white px-2 py-1 rounded-full bg-red-600/20 hover:bg-orange-600/30 transition-all duration-300 text-sm"
                    >
                        ✨
                    </motion.button>
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        onClick={() => setIsNotificationOpen((prev) => !prev)}
                        className="relative cursor-pointer"
                    >
                        <FaBell size={25} className="text-gray-300 hover:text-orange-500 transition-colors duration-300" />
                        {notifications.length > 0 && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center shadow-[0_0_5px_rgba(255,0,0,0.6)]"
                            >
                                {notifications.length}
                            </motion.span>
                        )}
                        {isNotificationOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute right-0 mt-2 w-60 sm:w-72 bg-gray-800 rounded-lg shadow-[0_0_15px_rgba(255,0,0,0.3)] p-4 max-h-80 overflow-y-auto z-50"
                            >
                                {notifications.length > 0 ? (
                                    notifications.map((notif) => (
                                        <div
                                            key={notif._id}
                                            className="flex justify-between items-start p-2 border-b border-gray-700 last:border-0 text-white"
                                        >
                                            <div>
                                                <p className="text-sm">{notif.message}</p>
                                                <p className="text-xs text-gray-400">
                                                    {new Date(notif.createdAt).toLocaleString()}
                                                </p>
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.1, color: "#ef4444" }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleDeleteNotification(notif._id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                                            >
                                                <FaTrash size={12} />
                                            </motion.button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-400 text-sm">No notifications</p>
                                )}
                            </motion.div>
                        )}
                    </motion.div>
                    {/* Profile Image */}
                    <Link href="/profile">
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <Image
                                src={session?.user?.image || placeholder} 
                                alt="Profile"
                                width={32}
                                height={32}
                                className="rounded-full shadow-[0_0_10px_rgba(255,165,0,0.4)] hover:shadow-[0_0_15px_rgba(255,0,0,0.6)] transition-all duration-300"
                            />
                        </motion.div>
                    </Link>
                    {/* Login/Logout Button */}
                    {status === "authenticated" ? (
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255,165,0,0.6)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={()=>signOut()}
                            className="hidden sm:flex items-center gap-2 bg-red-600 text-white px-3 py-1 md:px-4 md:py-1 lg:px-6 lg:py-2 rounded-full hover:bg-orange-600 transition-all duration-300 text-sm md:text-base lg:text-lg font-extrabold uppercase tracking-wide shadow-[0_0_10px_rgba(255,0,0,0.4)]"
                        >
                            <FaSignOutAlt /> 
                        </motion.button>
                    ) : (
                        <Link href={"/sign-in"}>
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255,165,0,0.6)" }}
                            whileTap={{ scale: 0.95 }}
                            className="hidden sm:flex items-center gap-2 bg-red-600 text-white px-3 py-1 md:px-4 md:py-1 lg:px-6 lg:py-2 rounded-full hover:bg-orange-600 transition-all duration-300 text-sm md:text-base lg:text-lg font-extrabold uppercase tracking-wide shadow-[0_0_10px_rgba(255,0,0,0.4)]"
                        >
                            <FaSignInAlt /> Login
                        </motion.button>
                            </Link>
                    )}
                    {/* Mobile Login/Logout Icon */}
                    {status === "authenticated" ? (
                       
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={()=>signOut()}
                           
                            className="sm:hidden text-gray-300 hover:text-orange-500 transition-colors duration-300"
                        >
                            <FaSignOutAlt size={20} />
                        </motion.button>
                       
                       
                    ) : (
                        <Link href={"/sign-in"}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="sm:hidden text-gray-300 hover:text-orange-500 transition-colors duration-300"
                        >
                            <FaSignInAlt size={20} />
                        </motion.button>
                        </Link>
                    )}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                        className="md:hidden text-gray-300 hover:text-orange-500 focus:outline-none"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                            />
                        </svg>
                    </motion.button>
                </div>
            </motion.div>

            {/* Mobile Dropdown Menu */}
            {isMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="md:hidden fixed top-14 left-0 right-0 bg-gradient-to-r from-gray-950 to-gray-900 shadow-[0_0_20px_rgba(255,0,0,0.3)] z-40 p-4"
                >
                    <ul className="flex flex-col items-center gap-4">
                        {navLinks.map(({ name, path }) => (
                            <li key={path}>
                                <Link href={path} onClick={() => setIsMenuOpen(false)}>
                                    <motion.span
                                        whileHover={{ scale: 1.1, color: "#f97316" }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`text-base font-semibold uppercase tracking-wide transition-colors duration-300 ${
                                            isActive(path) ? "text-orange-500" : "text-gray-300 hover:text-orange-500"
                                        }`}
                                    >
                                        {name}
                                    </motion.span>
                                </Link>
                            </li>
                        ))}
                        <motion.div whileHover={{ scale: 1.05 }}>
                            <DropdownMenuDemo />
                        </motion.div>
                    </ul>
                </motion.div>
            )}

            {/* Mobile Bottom Navbar */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-950 to-gray-900 border-t-2 border-red-900/50 p-2 flex justify-around items-center shadow-[0_0_15px_rgba(255,0,0,0.3)] z-[999]"
            >
                {navLinks.map(({ name, path, icon: Icon }) => (
                    <Link key={path} href={path} className="flex flex-col items-center group">
                        <motion.div whileHover={{ scale: 1.2, y: -5 }} whileTap={{ scale: 0.9 }}>
                            <Icon
                                size={24}
                                className={`transition-all duration-300 ${
                                    isActive(path)
                                        ? "text-orange-500 scale-110"
                                        : "text-gray-400 group-hover:text-orange-500"
                                }`}
                            />
                        </motion.div>
                        <span
                            className={`text-xs mt-1 font-semibold uppercase ${
                                isActive(path) ? "text-orange-500" : "text-gray-400 group-hover:text-orange-500"
                            }`}
                        >
                            {name}
                        </span>
                    </Link>
                ))}
            </motion.div>

            {showChatbot && <Gymmy onClose={() => setShowChatbot(false)} />}
        </nav>
    );
};

export default Navbar;