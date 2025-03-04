"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { FaHome, FaCog, FaBoxOpen, FaDollarSign, FaEnvelope, FaBell, FaTrash, FaSignInAlt, FaSignOutAlt, FaComments, FaTimes } from "react-icons/fa"; // Added FaComments
import { motion, AnimatePresence } from "framer-motion";
import gymlogo from "@/public/gymlogo.jpg";
import { useSession, signOut } from "next-auth/react";
import placeholder from "@/public/placeholder.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios"; // Added for Gymmy
import GymmyLoading from "./GymmyLoading"; // Added for Gymmy
import { Send } from "lucide-react";

// Props Interface for Gymmy
interface GymmyProps {
  onClose: () => void;
}

// Animation Variants for Gymmy
const ANIMATION_VARIANTS = {
  container: { initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 50 }, transition: { duration: 0.5, ease: "easeOut" } },
  header: { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.2, duration: 0.5 } },
  message: { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.3 } },
  loading: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
};

// Gymmy Component
const Gymmy: React.FC<GymmyProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 400, y: window.innerHeight - 600 });
  const [isDragging, setIsDragging] = useState(false);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startDragging = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    dragStartPos.current = { x: clientX - position.x, y: clientY - position.y };
  }, [position]);

  const onDrag = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging || !dragStartPos.current) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const newX = clientX - dragStartPos.current.x;
    const newY = clientY - dragStartPos.current.y;

    const maxX = window.innerWidth - (chatRef.current?.offsetWidth || 400);
    const maxY = window.innerHeight - (chatRef.current?.offsetHeight || 600);
    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY)),
    });
  }, [isDragging]);

  const stopDragging = useCallback(() => {
    setIsDragging(false);
    dragStartPos.current = null;
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", onDrag);
      window.addEventListener("mouseup", stopDragging);
      window.addEventListener("touchmove", onDrag);
      window.addEventListener("touchend", stopDragging);
    }
    return () => {
      window.removeEventListener("mousemove", onDrag);
      window.removeEventListener("mouseup", stopDragging);
      window.removeEventListener("touchmove", onDrag);
      window.removeEventListener("touchend", stopDragging);
    };
  }, [isDragging, onDrag, stopDragging]);

  const simulateTyping = useCallback(async (text: string, callback: (typedText: string) => void) => {
    let typedText = "";
    for (const char of text) {
      typedText += char;
      callback(typedText);
      await new Promise((resolve) => setTimeout(resolve, 30));
    }
  }, []);

  const formatBotResponse = useCallback((rawText: string): string => {
    return rawText.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\n\s*\n/g, " ").replace(/\n/g, " ").trim();
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || isLoading) return;

      const userMessage = `You: ${input}`;
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);

      try {
        const response = await axios.post(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent",
          { contents: [{ parts: [{ text: input }] }] },
          {
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": process.env.NEXT_PUBLIC_GEMINI_API_KEY,
            },
          }
        );

        const botReply = response.data.candidates[0].content.parts[0].text;
        const formattedReply = formatBotResponse(botReply);

        await simulateTyping(formattedReply, (typedText) => {
          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage && lastMessage.startsWith("Bot: ")) {
              return [...prev.slice(0, -1), `Bot: ${typedText}`];
            }
            return [...prev, `Bot: ${typedText}`];
          });
        });
      } catch (error) {
        console.error("Error fetching bot response:", error);
        setMessages((prev) => [...prev, "Bot: Oops, something broke! Try again."]);
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, formatBotResponse, simulateTyping]
  );

  return (
    <motion.div
      {...ANIMATION_VARIANTS.container}
      ref={chatRef}
      style={{
        position: "fixed",
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: "20rem",
        height: "32rem",
        zIndex: 1000,
      }}
      className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border-2 border-orange-600/60 overflow-hidden flex flex-col shadow-[0_0_20px_rgba(255,165,0,0.4)]"
    >
      <motion.div
        {...ANIMATION_VARIANTS.header}
        onMouseDown={startDragging}
        onTouchStart={startDragging}
        className="flex justify-between items-center p-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-t-2xl cursor-move"
      >
        <h2 className="text-xl font-extrabold uppercase tracking-wider">Gymmy Chat</h2>
        <motion.button
          whileHover={{ scale: 1.2, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors"
          aria-label="Close Gymmy Chat"
        >
          <FaTimes size={20} />
        </motion.button>
      </motion.div>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-800/90 backdrop-blur-md scrollbar-thin scrollbar-thumb-orange-600/50 scrollbar-track-gray-900">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              {...ANIMATION_VARIANTS.message}
              className={`p-3 my-2 rounded-2xl max-w-[85%] text-sm font-medium ${
                msg.startsWith("You:") ? "bg-gradient-to-r from-red-500 to-orange-500 text-white ml-auto" : "bg-gradient-to-r from-gray-700 to-gray-600 text-gray-100"
              }`}
            >
              {msg}
            </motion.div>
          ))}
          {isLoading && (
            <motion.div {...ANIMATION_VARIANTS.loading} className="p-3 my-2 rounded-2xl max-w-[85%] bg-gray-700/50 flex justify-center">
              <GymmyLoading />
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex items-center p-4 border-t-2 border-orange-600/60 bg-gray-900/90 backdrop-blur-md">
        <motion.input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Gymmy anything..."
          whileFocus={{ scale: 1.02 }}
          className="flex-1 p-3 text-white bg-gray-800/60 border-2 border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 placeholder-gray-500 font-medium"
          aria-label="Chat input"
          disabled={isLoading}
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          disabled={isLoading}
          className="ml-4 p-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl hover:from-red-700 hover:to-orange-700 transition-all duration-300 disabled:opacity-50"
          aria-label="Send message"
        >
          <Send size={18} />
        </motion.button>
      </form>
    </motion.div>
  );
};

interface NavLink {
  name: string;
  path: string;
  icon: React.ElementType;
  adminOnly?: boolean;
}

interface NotificationItem {
  _id: string;
  message: string;
  createdAt: string;
}

const DropdownMenuDemo: React.FC = () => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.isAdmin;
  const [position, setPosition] = useState("bottom");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 10px rgba(255,165,0,0.5)" }}
          whileTap={{ scale: 0.95 }}
          className="text-white bg-gradient-to-r from-red-600/20 to-orange-600/20 px-3 py-1 rounded-full border-2 border-red-600/50 hover:from-red-600/30 hover:to-orange-600/30 transition-all duration-300 font-semibold uppercase tracking-wide shadow-[0_0_5px_rgba(255,0,0,0.3)]"
        >
          More
        </motion.button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-red-900/50 shadow-[0_0_15px_rgba(255,0,0,0.3)] rounded-lg text-white">
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition} className="p-2">
          <Link href="/Timetable">
            <DropdownMenuRadioItem
              value="top"
              className="bg-transparent text-gray-300 hover:text-orange-500 focus:text-orange-500 cursor-pointer transition-colors duration-200 font-semibold uppercase tracking-wide"
            >
              Timetable
            </DropdownMenuRadioItem>
          </Link>
          {isAdmin && (
            <Link href="/admin/dashboard">
              <DropdownMenuRadioItem
                value="bottom"
                className="bg-transparent text-gray-300 hover:text-orange-500 focus:text-orange-500 cursor-pointer transition-colors duration-200 font-semibold uppercase tracking-wide"
              >
                Admin Dashboard
              </DropdownMenuRadioItem>
            </Link>
          )}
          <Link href="/plans">
            <DropdownMenuRadioItem
              value="right"
              className="bg-transparent text-gray-300 hover:text-orange-500 focus:text-orange-500 cursor-pointer transition-colors duration-200 font-semibold uppercase tracking-wide"
            >
              Workouts
            </DropdownMenuRadioItem>
          </Link>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [showChatbot, setShowChatbot] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAdmin = session?.user?.isAdmin
  const isActive = (route: string): boolean => pathname === route;

  const allNavLinks: NavLink[] = [
    { name: "HOME", path: "/", icon: FaHome },
    { name: "SERVICES", path: "/#services", icon: FaCog },
    { name: "PRODUCTS", path: "/products", icon: FaBoxOpen },
    { name: "SUBSCRIPTIONS", path: "/#billing", icon: FaDollarSign },
    { name: "CONTACT", path: "/contact", icon: FaEnvelope },
  ];

  const navLinks = isAdmin ? allNavLinks : allNavLinks.filter((link) => !link.adminOnly);

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

  const handleLinkClick = () => {
    setIsMenuOpen(false);
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
                    isActive(path) ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-300 hover:text-orange-500"
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
        
          {/* Desktop Chatbot Toggle */}
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255,165,0,0.6)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowChatbot((prev) => !prev)}
            className="hidden md:flex border-2 border-red-600 text-white p-1 md:px-3 md:py-1 rounded-full bg-gradient-to-r from-red-600/20 to-orange-600/20 hover:from-red-600/30 hover:to-orange-600/30 transition-all duration-300 text-base lg:text-lg font-bold uppercase tracking-wide"
          >
           ✨ AI
          </motion.button>
          {/* Mobile Chatbot Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowChatbot((prev) => !prev)}
            className="md:hidden border-2 border-red-600 text-white px-2 py-1 rounded-full bg-red-600/20 hover:bg-orange-600/30 transition-all duration-300 text-sm"
          >
            <FaComments size={16} /> 
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
                        <p className="text-xs text-gray-400">{new Date(notif.createdAt).toLocaleString()}</p>
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
              onClick={() => signOut()}
              className="hidden sm:flex items-center gap-2 bg-red-600 text-white px-3 py-1 md:px-4 md:py-1 lg:px-6 lg:py-2 rounded-full hover:bg-orange-600 transition-all duration-300 text-sm md:text-base lg:text-lg font-extrabold uppercase tracking-wide shadow-[0_0_10px_rgba(255,0,0,0.4)]"
            >
              <FaSignOutAlt />
            </motion.button>
          ) : (
            <Link href="/sign-in">
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
              onClick={() => signOut()}
              className="sm:hidden lg:hidden flex items-center gap-2 bg-red-600 text-white px-3 py-1 md:px-4 md:py-1 lg:px-6 lg:py-2 rounded-full hover:bg-orange-600 transition-all duration-300 text-[10px] md:text-base lg:text-lg font-extrabold uppercase tracking-wide shadow-[0_0_10px_rgba(255,0,0,0.4)]"
            >
              <FaSignOutAlt size={20} />
              <p>LogOut</p>
            </motion.button>
          ) : (
            <Link href="/sign-in">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="sm:hidden lg:hidden flex items-center gap-2 bg-red-600 text-white px-3 py-1 md:px-4 md:py-1 lg:px-6 lg:py-2 rounded-full hover:bg-orange-600 transition-all duration-300 text-[10px] md:text-base lg:text-lg font-extrabold uppercase tracking-wide shadow-[0_0_10px_rgba(255,0,0,0.4)]"
              >
                <FaSignInAlt size={20} />
                <p>LogIn</p>
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
                <Link href={path} onClick={handleLinkClick}>
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
          <Link key={path} href={path} className="flex flex-col items-center group" onClick={handleLinkClick}>
            <motion.div whileHover={{ scale: 1.2, y: -5 }} whileTap={{ scale: 0.9 }}>
              <Icon
                size={24}
                className={`transition-all duration-300 ${
                  isActive(path) ? "text-orange-500 scale-110" : "text-gray-400 group-hover:text-orange-500"
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

      {/* Draggable Chatbot */}
      <AnimatePresence>
        {showChatbot && <Gymmy onClose={() => setShowChatbot(false)} />}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;