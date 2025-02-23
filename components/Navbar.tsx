"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { FaHome, FaCog, FaBoxOpen, FaDollarSign, FaEnvelope } from "react-icons/fa";
import gymlogo from "@/public/gymlogo.jpg";
import placeholderImage from "@/public/placeholder.png";
import Gymmy from "./Gymmy";

// Define type for navigation links
interface NavLink {
  name: string;
  path: string;
  icon: React.ElementType;
}

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [showChatbot, setShowChatbot] = useState(false);

  const isActive = (route: string): boolean => pathname === route;

  const navLinks: NavLink[] = [
    { name: "HOME", path: "/", icon: FaHome },
    { name: "SERVICES", path: "/services", icon: FaCog },
    { name: "PRODUCTS", path: "/products", icon: FaBoxOpen },
    { name: "SUBSCRIPTIONS", path: "/subscriptions", icon: FaDollarSign },
    { name: "CONTACT", path: "/contact", icon: FaEnvelope },
  ];

  return (
    <nav className="flex flex-col">
      {/* Desktop Navbar */}
      <div className=" lg:flex flex justify-between items-center p-4">
        <div className="flex items-center gap-2">
          <Image src={gymlogo} alt="Gym Logo" width={600} height={600} className="object-contain  h-10 w-10" />
          <h1 className="sm:text-3xl font-serif font-bold">
            FITN<strong className="text-orange-500">ASE</strong>
          </h1>
        </div>
        <ul className="hidden lg:flex gap-8">
          {navLinks.map(({ name, path }) => (
            <li key={path}>
              <Link href={path} className={`transition-colors duration-300 hover:text-orange-500 ${
                isActive(path) ? "text-orange-500 underline underline-offset-4" : ""
              }`}>
                {name}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-4">
          <button
            className="border hidden sm:flex lg:flex  border-orange-500 text-orange-500 px-4 py-2 rounded-lg"
            onClick={() => setShowChatbot((prev) => !prev)}
          >
            ✨ASK GYMMY
          </button>
          <button
            className="border sm:hidden lg:hidden border-orange-500 text-orange-500 px-4 py-2 rounded-lg"
            onClick={() => setShowChatbot((prev) => !prev)}
          >
            ✨
          </button>
          <Image src={placeholderImage} alt="Profile" width={40} height={40} className="rounded-full" />
          <button className="bg-orange-500 sm:block hidden text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition">
            JOIN US
          </button>
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="lg:hidden z-[999] fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4 flex justify-around items-center">
        {navLinks.map(({ name, path, icon: Icon }) => (
          <Link key={path} href={path} className="flex flex-col items-center group">
            <Icon size={24} className={`transition duration-300 ${
              isActive(path) ? "text-orange-500 scale-110" : "text-gray-500 group-hover:text-orange-500"
            }`} />
            <span className={`text-xs mt-1 ${isActive(path) ? "text-orange-500 font-semibold" : "text-gray-500"}`}>
              {name}
            </span>
          </Link>
        ))}
      </div>

      {/* Chatbot Overlay */}
      {showChatbot && <Gymmy onClose={() => setShowChatbot(false)} />}
    </nav>
  );
};

export default Navbar;
