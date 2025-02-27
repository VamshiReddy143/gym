// components/Navbar.tsx
"use client";

import React, { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";

interface Notification {
    _id: string;
    message: string;
    createdAt: string;
}

const Notification = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get("/api/notifications");
                if (response.data.success) {
                    setNotifications(response.data.notifications);
                }
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        fetchNotifications();
        // Optional: Poll for new notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <nav className="bg-gradient-to-r from-gray-900 to-black p-4 flex justify-between items-center fixed w-full top-0 z-40">
            <div className="text-2xl font-bold text-white">Gym App</div>
            <div className="relative">
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="text-white cursor-pointer relative"
                >
                    <FaBell size={24} />
                    {notifications.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                            {notifications.length}
                        </span>
                    )}
                </motion.div>
                {isDropdownOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-[0_0_15px_rgba(255,0,0,0.3)] p-4 max-h-80 overflow-y-auto"
                    >
                        {notifications.length > 0 ? (
                            notifications.map((notif) => (
                                <div key={notif._id} className="text-white p-2 border-b border-gray-700 last:border-0">
                                    <p className="text-sm">{notif.message}</p>
                                    <p className="text-xs text-gray-400">
                                        {new Date(notif.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 text-sm">No notifications</p>
                        )}
                    </motion.div>
                )}
            </div>
        </nav>
    );
};

export default Notification;