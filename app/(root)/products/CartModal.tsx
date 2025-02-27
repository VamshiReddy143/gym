"use client";

import React from "react";
import NextImage from "next/image";
import { motion } from "framer-motion";
import { FaMinus, FaPlus } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

interface CartItem {
    _id: string;
    name: string;
    image: string;
    price: number;
    description: string;
    category: string;
    quantity: number;
}

interface CartModalProps {
    cartItems: CartItem[];
    onClose: () => void;
    onUpdateQuantity: (productId: string, quantity: number) => void;
    onCheckout: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ cartItems = [], onClose, onUpdateQuantity, onCheckout }) => {
    const total = cartItems.length > 0 ? cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) : 0;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/80 flex justify-center items-center z-[1000]"
        >
            <motion.div
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md bg-gradient-to-br from-gray-900 to-gray-800 shadow-[0_0_30px_rgba(255,165,0,0.6)] rounded-3xl p-6 max-h-[80vh] overflow-y-auto"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-extrabold text-white uppercase tracking-wide text-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                        Your Cart
                    </h2>
                    <motion.button
                        whileHover={{ scale: 1.2, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        className="text-orange-500 hover:text-orange-600 transition-colors"
                    >
                        <IoClose size={28} />
                    </motion.button>
                </div>

                {cartItems.length === 0 ? (
                    <p className="text-gray-400 text-center text-lg font-medium">Your cart is empty</p>
                ) : (
                    <>
                        {cartItems.map((item) => (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="flex items-center gap-4 mb-4 bg-gray-800/50 p-4 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.3)]"
                            >
                                <NextImage
                                    src={item.image}
                                    alt={item.name}
                                    width={80}
                                    height={80}
                                    className="rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-white">{item.name}</h3>
                                    <p className="text-orange-500 font-semibold">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => onUpdateQuantity(item._id, Math.max(1, item.quantity - 1))}
                                            className="p-1 bg-red-600 rounded-full text-white"
                                        >
                                            <FaMinus size={12} />
                                        </motion.button>
                                        <span className="text-white font-medium">{item.quantity}</span>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                                            className="p-1 bg-orange-600 rounded-full text-white"
                                        >
                                            <FaPlus size={12} />
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        <div className="mt-6">
                            <p className="text-xl font-bold text-white uppercase tracking-wide">
                                Total: <span className="text-orange-500">${total.toFixed(2)}</span>
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255,165,0,0.6)" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onCheckout}
                                className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white text-lg font-bold uppercase rounded-full hover:from-red-700 hover:to-orange-700 transition-all duration-300 shadow-[0_0_15px_rgba(255,0,0,0.5)]"
                            >
                                Checkout
                            </motion.button>
                        </div>
                    </>
                )}
            </motion.div>
        </motion.div>
    );
};

export default CartModal;