"use client";

import { useUserId } from "@/app/hooks/useUserId";
import { motion, AnimatePresence } from "framer-motion";
import { PencilIcon, RefreshCcwIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useCallback } from "react";
import { FaTrophy } from "react-icons/fa";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Type Definitions
interface Challenge {
  _id: string;
  name: string;
  description: string;
  points: number;
  completed?: boolean;
}

interface OrderItem {
  product: { price: number };
  quantity: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  createdAt: string;
}

interface UserData {
  name: string;
  image?: string;
  gender?: string;
  createdAt: string;
  email: string;
  phonenumber?: string;
  Address?: string;
  subscription?: {
    planName?: string;
    plan?: string;
    startDate?: string;
    endDate?: string;
    price?: number;
    qrCode?: string;
  };
  awards?: string[];
  streak?: number;
  completedChallenges?: string[];
  isAdmin?: boolean;
}

interface AdminDashboardData {
  totalRevenue: number;
  productsSold: number;
  orders: Order[];
}

// Constants
const ANIMATION_VARIANTS = {
  header: { initial: { opacity: 0, y: -80 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1, ease: "easeOut", type: "spring", stiffness: 100 } },
  card: { initial: { opacity: 0, x: -150 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.9, type: "spring", stiffness: 80 } },
  challenge: (index: number) => ({ initial: { opacity: 0, scale: 0.85, y: 50 }, animate: { opacity: 1, scale: 1, y: 0 }, transition: { duration: 0.6, delay: 0.1 * index, type: "spring", stiffness: 90 } }),
  popup: { initial: { opacity: 0, scale: 0.5 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.5 }, transition: { duration: 0.5, type: "spring", stiffness: 100 } },
};

const Page: React.FC = () => {
  const userId = useUserId();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [adminData, setAdminData] = useState<AdminDashboardData | null>(null);
  const [showCongrats, setShowCongrats] = useState(false);

  // Fetch Challenges
  const fetchChallenges = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await fetch("/api/challenges", { headers: { userId }, cache: "no-store" });
      if (!response.ok) throw new Error("Failed to fetch challenges");
      const data = await response.json();
      setChallenges(data.challenges || []);
    } catch (error) {
      console.error("Error fetching challenges:", error);
    }
  }, [userId]);

  // Fetch Orders for Non-Admins
  const fetchOrders = useCallback(async () => {
    if (!userId || (userData && userData.isAdmin)) return;
    try {
      const response = await fetch(`/api/orders/user?userId=${userId}`, { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders || []);
        const total = data.orders.reduce((sum: number, order: Order) => {
          const orderTotal = order.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
          return sum + orderTotal;
        }, 0);
        setTotalSpent(total);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }, [userId, userData]);

  // Fetch Admin Dashboard Data
  const fetchAdminData = useCallback(async () => {
    if (!userId || !userData?.isAdmin) return;
    try {
      const response = await fetch("/api/admin/dashboard", { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to fetch admin data");
      const data = await response.json();
      if (data.success) {
        setAdminData({
          totalRevenue: data.totalRevenue || 0,
          productsSold: data.productsSold || 0,
          orders: data.orders || [],
        });
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
  }, [userId, userData]);

  // Fetch User Data
  const fetchUserData = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/profile?userId=${userId}`, { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to fetch user data");
      const data = await response.json();
      if (data.success) {
        setUserData(data.user);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserData();
    fetchChallenges();
  }, [fetchUserData, fetchChallenges]);

  useEffect(() => {
    if (userData) {
      if (userData.isAdmin) fetchAdminData();
      else fetchOrders();
    }
  }, [userData, fetchOrders, fetchAdminData]);

  const completeChallenge = useCallback(
    async (challengeId: string) => {
      try {
        const response = await fetch(`/api/challenges/complete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, challengeId }),
        });
        if (!response.ok) throw new Error("Failed to complete challenge");
        const data = await response.json();

        // Update local challenges state
        setChallenges((prev) => prev.map((ch) => (ch._id === challengeId ? { ...ch, completed: true } : ch)));

        // Update userData with completed challenges and streak
        setUserData((prev) => {
          if (!prev) return prev;
          const updatedCompletedChallenges = data.user.completedChallenges || prev.completedChallenges;
          return { ...prev, completedChallenges: updatedCompletedChallenges, streak: data.user.streak || prev.streak };
        });

        // Check if all challenges are completed and trigger popup
        const allCompleted = challenges.every((ch) => (ch._id === challengeId ? true : userData?.completedChallenges?.includes(ch._id)));
        if (allCompleted && localStorage.getItem("congratsShown")) {
          setShowCongrats(true);
          localStorage.setItem("congratsShown", "true");
        }
      } catch (error) {
        console.error("Error completing challenge:", error);
        alert("Failed to complete the challenge. Please try again later.");
      }
    },
    [userId, challenges, userData]
  );

  // Download Membership Slip
  const downloadMembershipSlip = () => {
    const element = document.getElementById("membership-slip");
    if (!element) return;

    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${userData?.name || "User"}_Membership_Slip.pdf`);
    });
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-20 h-20 border-8 border-t-red-600 border-orange-600/50 rounded-full relative"
        >
          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-lg">💪</span>
        </motion.div>
      </div>
    );
  }

  // No User Data State
  if (!userData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-center text-gray-300 text-xl sm:text-3xl font-extrabold uppercase tracking-wider">User Not Found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-8 py-12 sm:py-16 overflow-hidden relative">
      {/* SEO-friendly hidden heading */}
      <h1 className="sr-only">{`${userData.name}'s Profile Dashboard`}</h1>

      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,0,0,0.2),_transparent_60%)] pointer-events-none opacity-70" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(255,165,0,0.2),_transparent_60%)] pointer-events-none opacity-70" />
      <div className="absolute inset-0 bg-[url('/gym-texture.png')] opacity-10 pointer-events-none" />

      {/* Header */}
      <motion.h1
        {...ANIMATION_VARIANTS.header}
        className="text-4xl sm:text-6xl md:text-8xl font-extrabold text-center mb-12 sm:mb-20 tracking-tighter uppercase relative"
      >
        <span className="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent">{userData.name}</span>
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }} className="block text-xl sm:text-3xl md:text-4xl mt-4 text-gray-300 font-bold tracking-wide">
          Dominate Your Destiny 💪
        </motion.span>
        <motion.div
          className="absolute -bottom-4 sm:-bottom-6 left-1/2 transform -translate-x-1/2 h-1 w-1/2 sm:w-1/3 bg-gradient-to-r from-red-600 to-orange-600 rounded-full"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        />
      </motion.h1>

      {/* Navigation Buttons */}
      <div className="fixed z-50">
        <motion.div {...ANIMATION_VARIANTS.card} transition={{ delay: 0.2 }} className="hidden sm:block fixed top-24 right-4">
          <Link href="/leaderboards">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-[rgba(20,20,20,0.9)] border-2 border-orange-500 rounded-full flex items-center gap-2"
              aria-label="View Leaderboard"
            >
              <FaTrophy className="w-5 sm:w-6 h-5 sm:h-6 text-yellow-400" />
              <span className="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent text-base sm:text-xl font-extrabold uppercase">Leaderboard</span>
            </motion.button>
          </Link>
        </motion.div>
        {userData.isAdmin && (
          <motion.div {...ANIMATION_VARIANTS.card} transition={{ delay: 0.3 }} className="hidden sm:block fixed top-40 right-4">
            <Link href="/admin/dashboard">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-[rgba(20,20,20,0.9)] border-2 border-red-500 rounded-full"
                aria-label="View Admin Dashboard"
              >
                <span className="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent text-base sm:text-xl font-extrabold uppercase">Dashboard</span>
              </motion.button>
            </Link>
          </motion.div>
        )}
        <motion.div {...ANIMATION_VARIANTS.card} transition={{ delay: 0.2 }} className="block sm:hidden fixed top-20 right-2">
          <Link href="/leaderboards">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-[rgba(20,20,20,0.9)] border-2 border-orange-500 rounded-full"
              aria-label="View Leaderboard"
            >
              <FaTrophy className="w-5 h-5 text-yellow-400" />
            </motion.button>
          </Link>
        </motion.div>
        {userData.isAdmin && (
          <motion.div {...ANIMATION_VARIANTS.card} transition={{ delay: 0.3 }} className="block sm:hidden fixed top-32 right-2">
            <Link href="/admin/dashboard">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 bg-[rgba(20,20,20,0.9)] border-2 border-red-500 rounded-full"
                aria-label="View Admin Dashboard"
              >
                <span className="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent text-lg font-extrabold uppercase">D</span>
              </motion.button>
            </Link>
          </motion.div>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-full mx-auto space-y-12 sm:space-y-16">
        {/* Profile & Stats */}
        <motion.div
          {...ANIMATION_VARIANTS.card}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-gray-950 to-gray-900 border-2 border-red-900/60 p-6 sm:p-10 rounded-2xl shadow-[0_0_30px_rgba(255,0,0,0.4)] relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,0,0,0.2),_transparent_80%)] opacity-40 pointer-events-none" />
          <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-10 relative z-10">
            <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }} className="relative flex-shrink-0">
              <Image
                src={userData.image || "https://imgs.search.brave.com/jDRn2PRE1fbtjxX1wxqOilFWACcMOCjTuxl32xMbb9M/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuY3RmYXNzZXRz/Lm5ldC9paHgwYThj/aGlmcGMvZ1B5SEtE/R0kwbWQ0TmtSRGpz/NGs4LzM2YmUxZTcz/MDA4YTAxODFjMTk4/MGY3MjdmMjlkMDAy/L2F2YXRhci1wbGFj/ZWhvbGRlci1nZW5l/cmF0b3ItNTAweDUw/MC5qcGc_dz0xOTIw/JnE9NjAmZm09d2Vi/cA"}
                alt={`${userData.name}'s avatar`}
                width={180}
                height={180}
                className="rounded-full h-[180px] w-[180px] sm:h-[200px] sm:w-[200px] object-cover border-4 border-orange-600 shadow-[0_0_20px_rgba(255,165,0,0.6)]"
                loading="lazy"
              />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="absolute -top-4 -right-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-full w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center text-lg sm:text-xl font-bold"
              >
                {userData.gender === "male" ? "♂️" : userData.gender === "female" ? "♀️" : "⚡"}
              </motion.div>
            </motion.div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white uppercase tracking-wider">{userData.name}</h2>
                <Link href="/profile/edit" className="group">
                  <PencilIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 group-hover:text-orange-500 transition-colors" />
                </Link>
              </div>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-400 mt-2 sm:mt-3 italic font-semibold">
                Forging Greatness Since {new Date(userData.createdAt).getFullYear()} {new Date(userData.createdAt).toLocaleString("en-US", { month: "long" })}
              </p>
              {userData.awards && userData.awards.length > 0 && (
                <div className="flex flex-wrap gap-4 sm:gap-6 mt-6 sm:mt-8 justify-center md:justify-start">
                  {userData.awards.map((award, index) => (
                    <motion.div key={index} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                      <Image src={award} alt={`Award ${index + 1}`} width={60} height={60} className="object-contain" loading="lazy" />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="h-1 w-3/4 mx-auto bg-gradient-to-r from-red-600 to-orange-600 my-6 sm:my-10 rounded-full" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 text-center relative z-10">
            {userData.isAdmin ? (
              <>
                <motion.div whileHover={{ scale: 1.15, y: -5 }} className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:p-6 rounded-xl">
                  <h3 className="text-sm sm:text-xl font-bold text-red-500 uppercase">Total Income</h3>
                  <p className="text-xl sm:text-4xl font-extrabold text-white mt-2 tracking-tight">${adminData?.totalRevenue.toFixed(2) || "0.00"}</p>
                </motion.div>
                <Link href="/admin/orders">
                  <motion.div whileHover={{ scale: 1.15, y: -5 }} className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:p-6 rounded-xl">
                    <h3 className="text-sm sm:text-xl font-bold text-orange-500 uppercase">Products Sold</h3>
                    <p className="text-xl sm:text-4xl font-extrabold text-white mt-2 tracking-tight">{adminData?.productsSold || 0}</p>
                  </motion.div>
                </Link>
              </>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.15, y: -5 }} className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:p-6 rounded-xl">
                  <h3 className="text-sm sm:text-xl font-bold text-red-500 uppercase">Total Spent</h3>
                  <p className="text-xl sm:text-4xl font-extrabold text-white mt-2 tracking-tight">${totalSpent.toFixed(2)}</p>
                </motion.div>
                <Link href="/orders">
                  <motion.div whileHover={{ scale: 1.15, y: -5 }} className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:p-6 rounded-xl">
                    <h3 className="text-sm sm:text-xl font-bold text-orange-500 uppercase">Orders</h3>
                    <p className="text-xl sm:text-4xl font-extrabold text-white mt-2 tracking-tight">{orders.length}</p>
                  </motion.div>
                </Link>
              </>
            )}
            <motion.div whileHover={{ scale: 1.15, y: -5 }} className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:p-6 rounded-xl">
              <h3 className="text-sm sm:text-xl font-bold text-yellow-500 uppercase">Streak</h3>
              <p className="text-xl sm:text-4xl font-extrabold text-white mt-2 tracking-tight">🔥 {userData.streak || 0}</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Address Card */}
        <motion.div
          {...ANIMATION_VARIANTS.card}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-gray-950 to-gray-900 border-2 border-orange-900/60 p-6 sm:p-10 rounded-2xl shadow-[0_0_30px_rgba(255,165,0,0.4)] relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,165,0,0.2),_transparent_80%)] opacity-40 pointer-events-none" />
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 relative z-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white uppercase tracking-wider">Your Headquarters</h2>
            <Link href="/profile/edit" className="group">
              <PencilIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 group-hover:text-red-600 transition-colors" />
            </Link>
          </div>
          <div className="space-y-4 sm:space-y-6 text-base sm:text-xl relative z-10">
            <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-900/50 p-3 sm:p-4 rounded-xl">
              <strong className="text-red-500 font-bold uppercase">Location:</strong>
              <p className="text-gray-200 font-semibold">{userData.Address || "Set your base"}</p>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-900/50 p-3 sm:p-4 rounded-xl">
              <strong className="text-orange-500 font-bold uppercase">Email:</strong>
              <p className="text-gray-200 font-semibold">{userData.email}</p>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-900/50 p-3 sm:p-4 rounded-xl">
              <strong className="text-yellow-500 font-bold uppercase">Phone:</strong>
              <p className="text-gray-200 font-semibold">{userData.phonenumber || "set your mobile number"}</p>
            </div>
          </div>
        </motion.div>

        {/* Subscription Card */}
        <motion.div
          {...ANIMATION_VARIANTS.card}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-gray-950 to-gray-900 border-2 border-red-900/60 p-6 sm:p-10 rounded-2xl shadow-[0_0_30px_rgba(255,0,0,0.4)] relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,0,0,0.2),_transparent_80%)] opacity-40 pointer-events-none" />
          {userData.subscription && (userData.subscription.planName || userData.subscription.plan || userData.subscription.startDate) ? (
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white uppercase tracking-wider mb-6 sm:mb-8">
                Your <strong className="text-red-500 text-3xl sm:text-5xl">Elite</strong> Membership
              </h2>
              <div id="membership-slip" className="flex flex-col md:flex-row items-center gap-6 sm:gap-10">
                <div className="space-y-4 sm:space-y-6 flex-1 text-center md:text-left text-base sm:text-xl">
                  <p>
                    <span className="text-red-500 font-bold uppercase">Plan:</span>{" "}
                    <span className="text-white font-extrabold tracking-tight">
                      {userData.subscription.planName || userData.subscription.plan || "Free Membership"}
                      {userData.subscription.price === 0 && <span className="ml-2 px-2 py-1 bg-green-600 text-white text-xs sm:text-sm font-semibold rounded-full">Free</span>}
                    </span>
                  </p>
                  <p>
                    <span className="text-orange-500 font-bold uppercase">Expires:</span>{" "}
                    <span className="text-gray-200 font-semibold">
                      {userData.subscription.endDate ? new Date(userData.subscription.endDate).toLocaleDateString() : "N/A"}
                    </span>
                  </p>
                  <p>
                    <span className="text-yellow-500 font-bold uppercase">Started:</span>{" "}
                    <span className="text-gray-200 font-semibold">
                      {userData.subscription.startDate ? new Date(userData.subscription.startDate).toLocaleDateString() : "N/A"}
                    </span>
                  </p>
                  <p>
                    <span className="text-red-500 font-bold uppercase">Price:</span>{" "}
                    <span className="text-gray-200 font-semibold">${userData.subscription.price ?? 0}</span>
                  </p>
                  <p>
                    <span className="text-red-500 font-bold uppercase">Email:</span>{" "}
                    <span className="text-gray-200 font-semibold">{userData.email}</span>
                  </p>
                </div>
                {userData.subscription.qrCode && userData.subscription.qrCode.startsWith("data:image") ? (
                  <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }} className="relative flex-shrink-0">
                    <Image
                      src={userData.subscription.qrCode}
                      alt="Membership QR Code"
                      width={180}
                      height={180}
                      className="rounded-xl border-4 border-orange-600"
                      loading="lazy"
                    />
                  </motion.div>
                ) : (
                  <p className="text-gray-400 italic">No QR Code available</p>
                )}
              </div>
              <div className="mt-4 sm:mt-6 flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={fetchUserData}
                  className="px-4 sm:px-6 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold rounded-full"
                  aria-label="Refresh subscription data"
                >
                  <RefreshCcwIcon className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={downloadMembershipSlip}
                  className="px-4 sm:px-6 py-2 bg-gradient-to-r from-green-600 to-green-400 text-white font-semibold rounded-full"
                  aria-label="Download membership slip"
                >
                  Download Slip
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 sm:py-12 relative z-10">
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white uppercase tracking-wider animate-pulse">Unleash Your Potential</h2>
              <p className="text-lg sm:text-2xl text-gray-300 mt-4 sm:mt-6 font-semibold">No active plan—time to power up!</p>
              <Link
                href="/#billing"
                className="mt-6 sm:mt-8 inline-block px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white text-base sm:text-xl font-extrabold uppercase rounded-full hover:from-red-700 hover:to-orange-700 transition-all"
              >
                Join the Elite Now
              </Link>
            </div>
          )}
        </motion.div>

        {/* Challenges Section */}
        <motion.div {...ANIMATION_VARIANTS.card} transition={{ delay: 0.5 }}>
          <h2 className="text-2xl sm:text-4xl md:text-6xl font-extrabold text-white mb-8 sm:mb-12 uppercase tracking-tighter text-center relative">
            <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">Today’s Battleground</span>
            <motion.div
              className="absolute -bottom-2 sm:-bottom-4 left-1/2 transform -translate-x-1/2 h-1 w-1/2 sm:w-1/3 bg-gradient-to-r from-red-600 to-orange-600 rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            />
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
            {challenges.map((challenge, index) => (
              <motion.div
                key={challenge._id}
                {...ANIMATION_VARIANTS.challenge(index)}
                className="relative bg-gradient-to-br from-gray-950 to-gray-900 border-2 border-orange-900/60 p-6 sm:p-8 rounded-2xl shadow-[0_0_25px_rgba(255,0,0,0.4)] overflow-hidden"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,165,0,0.2),_transparent_80%)] opacity-50 pointer-events-none" />
                <h4 className="text-xl sm:text-3xl font-extrabold text-white uppercase tracking-wide relative z-10">{challenge.name}</h4>
                <p className="text-gray-300 mt-2 sm:mt-3 text-base sm:text-lg font-semibold relative z-10">{challenge.description}</p>
                <p className="mt-3 sm:mt-4 text-lg sm:text-2xl font-bold text-yellow-400 relative z-10">🎯 {challenge.points} PTS</p>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.preventDefault();
                    completeChallenge(challenge._id);
                  }}
                  disabled={challenge.completed || userData.completedChallenges?.includes(challenge._id)}
                  className={`mt-4 sm:mt-6 w-full py-3 sm:py-4 px-4 sm:px-6 rounded-full text-base sm:text-xl font-extrabold uppercase transition-all relative z-10 ${
                    userData.completedChallenges?.includes(challenge._id)
                      ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-red-600 to-orange-600 text-white hover:from-red-700 hover:to-orange-700"
                  }`}
                  aria-label={`Complete challenge: ${challenge.name}`}
                >
                  {userData.completedChallenges?.includes(challenge._id) ? "✅ Vanquished" : "⚡ Conquer Now"}
                </motion.button>
                {userData.completedChallenges?.includes(challenge._id) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0, rotate: -45 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute -top-4 -right-4 bg-gradient-to-r from-green-600 to-green-400 text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-1 sm:py-2 rounded-full transform rotate-12"
                  >
                    Victory ✅
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Congratulatory Popup */}
      <AnimatePresence>
        {showCongrats && (
          <motion.div
            {...ANIMATION_VARIANTS.popup}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-md"
            onClick={() => setShowCongrats(false)}
          >
            <motion.div
              className="bg-gradient-to-br from-gray-950 to-gray-900 border-2 border-orange-600 p-6 sm:p-8 rounded-2xl shadow-[0_0_50px_rgba(255,165,0,0.8)] text-center relative"
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              exit={{ y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="absolute -top-8 sm:-top-10 left-1/2 transform -translate-x-1/2 text-4xl sm:text-6xl text-yellow-400"
              >
                🏆
              </motion.div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white uppercase tracking-wider mb-4 sm:mb-6">Legendary Victory!</h2>
              <p className="text-lg sm:text-2xl text-gray-200 font-semibold mb-6 sm:mb-8">
                You’ve conquered all challenges, {userData.name}! Your greatness is unmatched!
              </p>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCongrats(false)}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white text-base sm:text-xl font-extrabold uppercase rounded-full transition-all"
                aria-label="Close congratulations popup"
              >
                Claim Your Glory
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Page;