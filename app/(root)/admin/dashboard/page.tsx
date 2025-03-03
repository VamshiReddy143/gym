"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { FaUsers, FaBoxOpen, FaDollarSign, FaTrash, FaGift, FaBell, FaSearch } from "react-icons/fa";
import axios from "axios";
import { useSession } from "next-auth/react";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";
import NextImage from "next/image";
import Link from "next/link";

// Types
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
  success?: boolean;
  message?: string;
}

// Constants
const DEFAULT_IMAGE = "/placeholder.png"; 
const ANIMATION_VARIANTS = {
  fadeIn: { opacity: 0, y: 50 },
  fadeInVisible: { opacity: 1, y: 0 },
};

// Utility Functions
const hasMembership = (subscription?: User["subscription"]) => !!subscription;

const AdminDashboard: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalUsers: 0,
    productsSold: 0,
    totalRevenue: 0,
    users: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modals, setModals] = useState({
    notification: false,
    membership: false,
    delete: false,
  });
  const [notificationMessage, setNotificationMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [successState, setSuccessState] = useState({ membership: false, delete: false });

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    if (status === "loading" || !session?.user?.id) return;
    setIsLoading(true);
    try {
      const { data } = await axios.get<DashboardData>("/api/admin/dashboard");
      if (data.success) {
        setDashboardData({
          totalUsers: data.totalUsers ?? 0,
          productsSold: data.productsSold ?? 0,
          totalRevenue: data.totalRevenue ?? 0,
          users: data.users ?? [],
        });
      } else {
        setError(data.message || "Failed to fetch dashboard data");
      }
    } catch (err) {
      setError("An error occurred while fetching data");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [session, status]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Memoized filtered users
  const filteredUsers = useMemo(
    () =>
      dashboardData.users.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [dashboardData.users, searchQuery]
  );

  // Handlers
  const handleDeleteMember = (userId: string) => {
    setSelectedUserId(userId);
    setModals((prev) => ({ ...prev, delete: true }));
    setSuccessState((prev) => ({ ...prev, delete: false }));
  };

  const confirmDeleteUser = async () => {
    if (!selectedUserId) return;
    try {
      const { data } = await axios.delete(`/api/admin/users/${selectedUserId}`);
      if (data.success) {
        setDashboardData((prev) => ({
          ...prev,
          totalUsers: prev.totalUsers - 1,
          users: prev.users.filter((user) => user._id !== selectedUserId),
        }));
        setSuccessState((prev) => ({ ...prev, delete: true }));
        setTimeout(() => closeModal("delete"), 1500);
      } else {
        alert("Failed to delete user");
      }
    } catch (err) {
      alert("Error deleting user");
      console.error(err);
    }
  };

  const handleGrantMembership = (userId: string) => {
    setSelectedUserId(userId);
    setModals((prev) => ({ ...prev, membership: true }));
    setSuccessState((prev) => ({ ...prev, membership: false }));
  };

  const confirmGrantMembership = async () => {
    if (!selectedUserId) return;
    try {
      const { data } = await axios.post(`/api/admin/grant-membership`, { userId: selectedUserId });
      if (data.success) {
        setDashboardData((prev) => ({
          ...prev,
          users: prev.users.map((user) =>
            user._id === selectedUserId ? { ...user, subscription: data.subscription } : user
          ),
        }));
        setSuccessState((prev) => ({ ...prev, membership: true }));
        setTimeout(() => closeModal("membership"), 1500);
      } else {
        alert("Failed to grant membership");
      }
    } catch (err) {
      alert("Error granting membership");
      console.error(err);
    }
  };

  const handleSendNotification = async () => {
    if (!notificationMessage.trim()) return alert("Notification message cannot be empty");
    try {
      const { data } = await axios.post("/api/admin/send-notification", { message: notificationMessage });
      if (data.success) {
        alert("Notification sent successfully!");
        setNotificationMessage("");
        closeModal("notification");
      } else {
        alert(`Failed to send notification: ${data.message}`);
      }
    } catch (err) {
      alert("Error sending notification");
      console.error(err);
    }
  };

  const closeModal = (type: "notification" | "membership" | "delete") => {
    setModals((prev) => ({ ...prev, [type]: false }));
    setSelectedUserId(null);
    setSuccessState((prev) => ({ ...prev, [type === "delete" ? "delete" : "membership"]: false }));
  };

  const handleUserClick = (userId: string) => router.push(`/profile/${userId}`);

  // Loading and Error States
  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <p className="text-red-500 text-xl font-semibold" role="alert">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-8 py-12 sm:py-16 overflow-hidden relative">
      {/* SEO-friendly meta content */}
      <h1 className="sr-only">Admin Dashboard - Control Hub</h1>

      {/* Background Effects */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,0,0,0.2),_transparent_70%)] pointer-events-none"
        animate={{ opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-[url('/gym-texture.png')] opacity-15 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.h1
          variants={ANIMATION_VARIANTS}
          initial="fadeIn"
          animate="fadeInVisible"
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-center uppercase tracking-tight text-white mb-8 sm:mb-12"
        >
          Admin <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">Control Hub</span>
        </motion.h1>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-10 sm:mb-12">
          {[
            { icon: <FaUsers />, title: "Total Users", value: dashboardData.totalUsers },
            { icon: <FaBoxOpen />, title: "Products Sold", value: dashboardData.productsSold },
            { icon: <FaDollarSign />, title: "Total Revenue", value: `$${dashboardData.totalRevenue.toFixed(2)}` },
          ].map((stat, idx) => (
            <motion.div
              key={stat.title}
              variants={ANIMATION_VARIANTS}
              initial="fadeIn"
              animate="fadeInVisible"
              transition={{ duration: 0.8, delay: idx * 0.2, ease: "easeOut" }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:p-6 rounded-2xl border-2 border-red-900/50 hover:shadow-[0_0_15px_rgba(255,165,0,0.4)] transition-all duration-300"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="text-orange-500 text-3xl sm:text-4xl">{stat.icon}</span>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-300 uppercase">{stat.title}</h2>
                  <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mt-1 sm:mt-2">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Notification Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setModals((prev) => ({ ...prev, notification: true }))}
          className="mb-6 sm:mb-8 sm:absolute top-0 right-0 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-red-600 to-orange-600 rounded-full font-semibold flex items-center gap-2"
          aria-label="Send Notification to Users"
        >
          <FaBell /> Send Notification
        </motion.button>

        {/* Notification Modal */}
        {modals.notification && (
          <Modal
            title="Send Notification"
            icon={<FaBell className="text-orange-500" />}
            onClose={() => closeModal("notification")}
            onConfirm={handleSendNotification}
          >
            <textarea
              value={notificationMessage}
              onChange={(e) => setNotificationMessage(e.target.value)}
              placeholder="Enter your notification message..."
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-orange-500"
              rows={4}
              aria-label="Notification Message"
            />
          </Modal>
        )}

        {/* Delete Modal */}
        {modals.delete && (
          <Modal
            title="Delete User"
            icon={<FaTrash className="text-red-500" />}
            onClose={() => closeModal("delete")}
            onConfirm={confirmDeleteUser}
            successState={successState.delete}
            successMessage="User Deleted Successfully!"
          >
            {!successState.delete && (
              <p className="text-gray-300 mb-6">Are you sure you want to delete this user? This action cannot be undone.</p>
            )}
          </Modal>
        )}

        {/* Membership Modal */}
        {modals.membership && (
          <Modal
            title="Grant Free Membership"
            icon={<FaGift className="text-green-500" />}
            onClose={() => closeModal("membership")}
            onConfirm={confirmGrantMembership}
            successState={successState.membership}
            successMessage="Membership Granted Successfully!"
          >
            {!successState.membership && (
              <p className="text-gray-300 mb-6">Are you sure you want to grant a free membership to this user?</p>
            )}
          </Modal>
        )}

        {/* User Management */}
        <motion.section
          variants={ANIMATION_VARIANTS}
          initial="fadeIn"
          animate="fadeInVisible"
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:p-6 rounded-2xl border-2 border-red-900/50"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-wide">User Management</h2>
            <Link href="/admin/orders" className="mt-2 sm:mt-0">
              <button className="px-3 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-red-600 to-orange-600 rounded-full font-semibold flex items-center gap-2">
                Orders <span>➩</span>
              </button>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="mb-4 sm:mb-6 flex items-center gap-3">
            <FaSearch className="text-gray-400 text-lg sm:text-xl" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users by name..."
              className="w-full p-2 sm:p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-orange-500"
              aria-label="Search Users"
            />
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm sm:text-base">
              <thead>
                <tr className="text-gray-400 font-bold uppercase border-b border-gray-700">
                  <th className="py-2 sm:py-3 px-2 sm:px-4">Image</th>
                  <th className="py-2 sm:py-3 px-2 sm:px-4">Name</th>
                  <th className="py-2 sm:py-3 px-2 sm:px-4">Email</th>
                  <th className="py-2 sm:py-3 px-2 sm:px-4">Role</th>
                  <th className="py-2 sm:py-3 px-2 sm:px-4">Membership</th>
                  <th className="py-2 sm:py-3 px-2 sm:px-4">Actions</th>
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
                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                      <motion.div whileHover={{ scale: 1.1 }} onClick={() => handleUserClick(user._id)}>
                        <NextImage
                          src={user.image || DEFAULT_IMAGE}
                          alt={`${user.name}'s profile`}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                          loading="lazy"
                        />
                      </motion.div>
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-300">
                      <button
                        onClick={() => handleUserClick(user._id)}
                        className="hover:text-orange-500 transition-colors duration-300"
                        aria-label={`View ${user.name}'s profile`}
                      >
                        {user.name}
                      </button>
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-300">{user.email}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                      <span
                        className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                          user.role === "admin" ? "bg-green-600" : user.role === "trainer" ? "bg-blue-600" : "bg-gray-600"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                          hasMembership(user.subscription)
                            ? "bg-green-600 text-white"
                            : "bg-gray-600 text-gray-300"
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
                    <td className="py-2 sm:py-3 px-2 sm:px-4 flex gap-2">
                      {user.role !== "admin" && (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteMember(user._id)}
                            className="p-2 bg-red-600 rounded-full hover:bg-red-700 transition-all duration-300"
                            aria-label={`Delete ${user.name}`}
                          >
                            <FaTrash size={16} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleGrantMembership(user._id)}
                            className="p-2 bg-green-600 rounded-full hover:bg-green-700 transition-all duration-300"
                            disabled={hasMembership(user.subscription)}
                            aria-label={`Grant membership to ${user.name}`}
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
        </motion.section>
      </div>
    </div>
  );
};

// Reusable Modal Component
interface ModalProps {
  title: string;
  icon: React.ReactNode;
  onClose: () => void;
  onConfirm: () => void;
  successState?: boolean;
  successMessage?: string;
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  title,
  icon,
  onClose,
  onConfirm,
  successState,
  successMessage,
  children,
}) => (
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
      className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:p-6 rounded-2xl border-2 border-red-900/50 w-full max-w-md"
    >
      {successState ? (
        <div className="text-center py-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-green-500 text-4xl mb-2"
          >
            ✓
          </motion.div>
          <p className="text-white text-lg font-semibold">{successMessage}</p>
        </div>
      ) : (
        <>
          <h3 className="text-xl sm:text-2xl font-extrabold uppercase tracking-wide mb-4 flex items-center gap-2">
            {icon} {title}
          </h3>
          {children}
          <div className="flex gap-4 mt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onConfirm}
              className={`flex-1 px-4 py-2 rounded-full font-semibold ${
                title.includes("Delete")
                  ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                  : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              }`}
            >
              {title.includes("Delete") ? "Yes, Delete" : "Yes, Grant"}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-600 rounded-full hover:bg-gray-700 font-semibold"
            >
              Cancel
            </motion.button>
          </div>
        </>
      )}
    </motion.div>
  </motion.div>
);

export default AdminDashboard;