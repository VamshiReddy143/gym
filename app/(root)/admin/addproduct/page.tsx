// app/admin/products/create/page.tsx
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaUpload, FaPlus, FaSpinner, FaTimes } from "react-icons/fa";
import { CldUploadWidget } from "next-cloudinary";
import NextImage from "next/image";

const CreateProductPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        image: "",
        price: "",
        description: "",
        category: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewVisible, setPreviewVisible] = useState(false);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (result: any) => {
        if (result.event === "success" && result.info && result.info.secure_url) {
            const imageUrl = result.info.secure_url;
            setFormData((prev) => ({ ...prev, image: imageUrl }));
            setPreviewVisible(true);
            console.log("Image uploaded:", imageUrl);
        } else {
            setError("Failed to upload image");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                }),
            });

            const result = await response.json();
            if (response.ok) {
                setSuccess(true);
                setFormData({ name: "", image: "", price: "", description: "", category: "" });
                setPreviewVisible(false);
                setTimeout(() => setSuccess(false), 3000);
            } else {
                setError(result.message || "Failed to create product");
            }
        } catch (err) {
            setError("An error occurred while creating the product");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden relative ">
            {/* Neon Grid Background */}
            <motion.div
                className="absolute inset-0 bg-[linear-gradient(to_right,#ff4500_1px,transparent_1px),linear-gradient(to_bottom,#ff4500_1px,transparent_1px)] bg-[size:40px_40px] opacity-10 pointer-events-none"
                animate={{ opacity: [0.2, 0.15, 0.2] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Cyberpunk Glow Overlay */}
            <motion.div
                className="absolute inset-0  pointer-events-none"
                animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.4, 0.3] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Main Content */}
            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                {/* <motion.h1
                    initial={{ opacity: 0, y: -60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold uppercase tracking-wider text-center mb-12 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,69,0,0.7)]"
                >
                    Forge a New Product
                </motion.h1> */}

                {/* Form Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="bg-[rgba(20,20,20,0.9)] p-6 md:p-8 rounded-2xl border-2 border-none shadow-[0_0_20px_rgba(255,69,0,0.7)] backdrop-blur-md"
                >
                    {(error || success) && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`text-center p-3 mb-4 rounded-lg font-semibold text-sm md:text-base ${
                                error ? "bg-red-900/50 text-red-300" : "bg-green-900/50 text-green-300"
                            }`}
                        >
                            {error || "Product forged successfully!"}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Product Name */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="relative group"
                        >
                            <label className="block text-base md:text-lg font-medium text-gray-200 mb-2">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full p-3 rounded-lg bg-gray-800/80 text-white border border-red-700/50 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 transition-all duration-300 placeholder-gray-500 shadow-[inset_0_0_8px_rgba(255,69,0,0.2)]"
                                placeholder="Enter product designation"
                                required
                            />
                          
                        </motion.div>

                        {/* Image Upload */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="relative group"
                        >
                            <label className="block text-base md:text-lg font-medium text-gray-200 mb-2">Image</label>
                            <CldUploadWidget
                                uploadPreset="gym_website"
                                onSuccess={handleImageUpload}
                                options={{
                                    maxFiles: 1,
                                    resourceType: "image",
                                    clientAllowedFormats: ["png", "jpg", "jpeg"],
                                    maxFileSize: 5000000,
                                    folder: "gym_products",
                                }}
                            >
                                {({ open }) => (
                                    <motion.button
                                        whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255,69,0,0.6)" }}
                                        whileTap={{ scale: 0.95 }}
                                        type="button"
                                        onClick={() => open()}
                                        className="w-full p-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-red-700 hover:to-orange-700 transition-all duration-300 shadow-[0_0_15px_rgba(255,69,0,0.4)]"
                                    >
                                        <FaUpload /> Upload Visual Data
                                    </motion.button>
                                )}
                            </CldUploadWidget>
                            {formData.image && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mt-4 relative group"
                                >
                                    <NextImage
                                        src={formData.image}
                                        alt="Product preview"
                                        width={180}
                                        height={180}
                                        className="rounded-lg border border-red-700/50 shadow-[0_0_15px_rgba(255,69,0,0.3)] group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <motion.button
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => {
                                            setFormData((prev) => ({ ...prev, image: "" }));
                                            setPreviewVisible(false);
                                        }}
                                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full shadow-[0_0_5px_rgba(255,0,0,0.5)]"
                                    >
                                        <FaTimes size={14} />
                                    </motion.button>
                                </motion.div>
                            )}
                        </motion.div>

                        {/* Price */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="relative group"
                        >
                            <label className="block text-base md:text-lg font-medium text-gray-200 mb-2">Price ($)</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                step="0.01"
                                className="w-full p-3 rounded-lg bg-gray-800/80 text-white border border-red-700/50 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 transition-all duration-300 placeholder-gray-500 shadow-[inset_0_0_8px_rgba(255,69,0,0.2)]"
                                placeholder="Set value"
                                required
                            />
                          
                        </motion.div>

                        {/* Description */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                            className="relative group"
                        >
                            <label className="block text-base md:text-lg font-medium text-gray-200 mb-2">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full p-3 rounded-lg bg-gray-800/80 text-white border border-red-700/50 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 transition-all duration-300 placeholder-gray-500 min-h-[140px] resize-none shadow-[inset_0_0_8px_rgba(255,69,0,0.2)]"
                                placeholder="Product specs"
                                required
                            />
                           
                        </motion.div>

                        {/* Category */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 }}
                            className="relative group"
                        >
                            <label className="block text-base md:text-lg font-medium text-gray-200 mb-2">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="w-full p-3 rounded-lg bg-gray-800/80 text-white
                                
                                 border border-red-700/50 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 transition-all duration-300 shadow-[inset_0_0_8px_rgba(255,69,0,0.2)]"
                                required
                            >
                                <option value="" disabled className="text-gray-500">
                                    Select Sector
                                </option>
                                <option value="bulk">Bulk</option>
                                <option value="cut">Cut</option>
                                <option value="items">Items</option>
                                <option value="supplements">Supplements</option>
                                <option value="accessories">Accessories</option>
                            </select>
                        
                        </motion.div>

                        {/* Submit Button */}
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(255,69,0,0.7)" }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg font-extrabold uppercase tracking-wider shadow-[0_0_20px_rgba(255,69,0,0.6)] hover:from-red-700 hover:to-orange-700 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <motion.span
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                >
                                    <FaSpinner size={20} />
                                </motion.span>
                            ) : (
                                <>
                                    <FaPlus size={20} /> Forge Product
                                </>
                            )}
                        </motion.button>
                    </form>
                </motion.div>
            </div>

            {/* Neon Pulse Effect */}
            <motion.div
                className="absolute inset-0 pointer-events-none z-0 border-4 border-red-600/30 rounded-[50%] opacity-0"
                animate={{ scale: [1, 1.2], opacity: [0, 0.2, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
                style={{ top: "10%", left: "10%", right: "10%", bottom: "10%" }}
            />
        </div>
    );
};

export default CreateProductPage;