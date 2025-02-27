"use client";

import Image from "next/image";
import gymlogo from "@/public/gymlogo.jpg";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-black py-12 shadow-[0_0_30px_rgba(255,0,0,0.3)] relative overflow-hidden">
      {/* Subtle Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,0,0,0.15),_transparent_70%)] opacity-40 pointer-events-none" />
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-transparent pointer-events-none"
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
        {/* Brand Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center md:items-start text-center md:text-left"
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="mb-4"
          >
            <Image
              src={gymlogo}
              alt="Gym Logo"
              width={60}
              height={60}
              className="object-contain rounded-full shadow-[0_0_15px_rgba(255,0,0,0.5)]"
            />
          </motion.div>
          <h2 className="text-3xl font-extrabold uppercase tracking-wider text-white">
            FITN
            <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
              ASE
            </span>
          </h2>
          <p className="mt-2 text-gray-400 text-sm">
            Your ultimate fitness destination.
          </p>
        </motion.div>

        {/* Links Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center md:items-start"
        >
          <h3 className="text-xl font-semibold text-red-500 mb-4">Quick Links</h3>
          <ul className="space-y-3 text-gray-300">
            {["Home", "Schedule", "Pricing", "Contact"].map((item, index) => (
              <motion.li
                key={index}
                whileHover={{ scale: 1.05, color: "#EF4444" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link href={`/${item.toLowerCase()}`} className="hover:text-red-500 transition-colors">
                  {item}
                </Link>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center md:items-start"
        >
          <h3 className="text-xl font-semibold text-red-500 mb-4">Contact Us</h3>
          <ul className="space-y-4 text-gray-300">
            <motion.li
              whileHover={{ scale: 1.05, color: "#EF4444" }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex items-center gap-2"
            >
              <Mail className="w-5 h-5 text-red-600" />
              <span>support@fitnase.com</span>
            </motion.li>
            <motion.li
              whileHover={{ scale: 1.05, color: "#EF4444" }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex items-center gap-2"
            >
              <Phone className="w-5 h-5 text-red-600" />
              <span>+1 (555) 123-4567</span>
            </motion.li>
            <motion.li
              whileHover={{ scale: 1.05, color: "#EF4444" }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex items-center gap-2"
            >
              <MapPin className="w-5 h-5 text-red-600" />
              <span>123 Fitness St, Gym City</span>
            </motion.li>
          </ul>
        </motion.div>
      </div>

      {/* Social Media & Copyright */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-8 pt-8 mt-12 border-t border-red-900/30 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm"
      >
        <p>© {new Date().getFullYear()} FITNASE. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          {[Facebook, Instagram, Twitter].map((Icon, index) => (
            <motion.a
              key={index}
              href="#"
              whileHover={{ scale: 1.2, color: "#EF4444", boxShadow: "0 0 10px rgba(255,0,0,0.4)" }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-gray-300 hover:text-red-500"
            >
              <Icon className="w-6 h-6" />
            </motion.a>
          ))}
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;