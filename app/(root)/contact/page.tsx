"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";
import { useRouter } from "next/navigation";

const Contact: React.FC = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate form submission (replace with actual API call)
        setIsSubmitted(true);
        setTimeout(() => {
            setIsSubmitted(false);
            setFormData({ name: "", email: "", message: "" });
            router.push("/"); // Redirect to home after submission (optional)
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden relative">
            {/* Background Effects */}
            <motion.div
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,0,0,0.2),_transparent_70%)] pointer-events-none"
                animate={{ opacity: [0.5, 0.7, 0.5] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="absolute inset-0 bg-[url('/gym-texture.png')] opacity-15 pointer-events-none" />

            {/* Main Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <motion.h1
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight text-center mb-12 drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]"
                >
                    Get in <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">Touch</span>
                </motion.h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                    {/* Left: Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 md:p-8 rounded-3xl border-2 border-red-900/50 shadow-[0_0_25px_rgba(255,0,0,0.4)]"
                    >
                        <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide mb-6 text-white">Contact Us</h2>
                        <div className="space-y-6">
                            <motion.div
                                whileHover={{ scale: 1.05, x: 5 }}
                                className="flex items-center gap-4"
                            >
                                <FaEnvelope className="text-red-600 text-2xl md:text-3xl" />
                                <div>
                                    <p className="text-gray-300 text-sm md:text-base">Email</p>
                                    <p className="text-white text-base md:text-lg font-semibold">support@fitnase.com</p>
                                </div>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05, x: 5 }}
                                className="flex items-center gap-4"
                            >
                                <FaPhone className="text-red-600 text-2xl md:text-3xl" />
                                <div>
                                    <p className="text-gray-300 text-sm md:text-base">Phone</p>
                                    <p className="text-white text-base md:text-lg font-semibold">+1 (555) 123-4567</p>
                                </div>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05, x: 5 }}
                                className="flex items-center gap-4"
                            >
                                <FaMapMarkerAlt className="text-red-600 text-2xl md:text-3xl" />
                                <div>
                                    <p className="text-gray-300 text-sm md:text-base">Location</p>
                                    <p className="text-white text-base md:text-lg font-semibold">123 Fitness Ave, Power City</p>
                                </div>
                            </motion.div>
                        </div>
                        {/* Social Icons */}
                        <div className="mt-8 flex gap-4 justify-center">
                            {["facebook", "twitter", "instagram"].map((platform) => (
                                <motion.a
                                    key={platform}
                                    href={`https://${platform}.com/fitnase`}
                                    target="_blank"
                                    whileHover={{ scale: 1.2, rotate: 10, color: "#f97316" }}
                                    className="text-gray-300 text-2xl md:text-3xl"
                                >
                                    <span className={`fab fa-${platform}`} />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right: Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                        className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 md:p-8 rounded-3xl border-2 border-red-900/50 shadow-[0_0_25px_rgba(255,0,0,0.4)]"
                    >
                        <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide mb-6 text-white">Send a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <input
                                    autoComplete="off"
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Your Name"
                                    className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-orange-500 transition-all duration-300 placeholder-gray-400"
                                    required
                                />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                            >
                                <input
                                    autoComplete="off"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Your Email"
                                    className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-orange-500 transition-all duration-300 placeholder-gray-400"
                                    required
                                />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                            >
                                <textarea
                                  autoComplete="off"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    placeholder="Your Message"
                                    className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-orange-500 transition-all duration-300 placeholder-gray-400 min-h-[150px] resize-none"
                                    required
                                />
                            </motion.div>
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255,165,0,0.6)" }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-3 rounded-full font-extrabold uppercase tracking-wide shadow-[0_0_15px_rgba(255,0,0,0.5)] hover:from-red-700 hover:to-orange-700 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                {isSubmitted ? (
                                    <motion.span
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    >
                                        ✈️ Sending...
                                    </motion.span>
                                ) : (
                                    <>
                                        <FaPaperPlane /> Send Message
                                    </>
                                )}
                            </motion.button>
                        </form>
                    </motion.div>
                </div>

                {/* Animated Background Particles */}
                <motion.div
                    className="absolute inset-0 pointer-events-none z-0"
                    animate={{
                        backgroundPosition: ["0% 0%", "100% 100%"],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    style={{
                        backgroundImage: "radial-gradient(circle, rgba(255,165,0,0.1) 1px, transparent 1px)",
                        backgroundSize: "20px 20px",
                    }}
                />
            </div>

           
        </div>
    );
};

export default Contact;