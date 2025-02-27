"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useSession } from "next-auth/react";
import NextImage from "next/image";
import Loading from "@/components/Loading";

interface OrderItem {
    product: {
        _id: string;
        name: string;
        image: string;
        price: number;
    };
    quantity: number;
    price: number;
}

interface Order {
    _id: string;
    items: OrderItem[];
    total: number;
    status: string;
    createdAt: string;
}

const UserOrdersPage = () => {
    const { data: session } = useSession();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!session?.user?.id) return;
            setLoading(true);
            try {
                const response = await axios.get("/api/orders/user");
                if (response.data.success) {
                    setOrders(response.data.orders);
                } else {
                    setError("Failed to fetch orders");
                }
            } catch (err) {
                setError("An error occurred while fetching orders");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [session]);

    if (loading) return <Loading />;
    if (error)
        return (
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center text-red-500 text-xl font-semibold min-h-screen flex justify-center items-center bg-black"
            >
                {error}
            </motion.p>
        );

    return (
        <div className="min-h-screen bg-black text-white px-8 py-16 overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,0,0,0.2),_transparent_70%)] pointer-events-none opacity-50" />
            <div className="max-w-7xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-4xl md:text-6xl font-extrabold text-center uppercase tracking-tight text-white mb-12 drop-shadow-[0_0_10px_rgba(255,0,0,0.3)]"
                >
                    Your <span className="text-orange-500">Orders</span>
                </motion.h1>

                {orders.length === 0 ? (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-center text-gray-400 text-xl font-semibold"
                    >
                        No orders yet
                    </motion.p>
                ) : (
                    <div className="space-y-8">
                        {orders.map((order) => (
                            <motion.div
                                key={order._id}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-3xl border-2 border-red-900/50 shadow-[0_0_15px_rgba(255,0,0,0.3)]"
                            >
                                <h2 className="text-2xl font-extrabold text-white uppercase tracking-wide mb-4">
                                    Order #{order._id.slice(-6)} -{" "}
                                    <span className="text-orange-500">{order.status}</span>
                                </h2>
                                <p className="text-gray-300 mb-4">
                                    Placed on: {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                                {order.items.map((item) => (
                                    <div key={item.product._id} className="flex items-center gap-4 mb-4">
                                        <NextImage
                                            src={item.product.image}
                                            alt={item.product.name}
                                            width={80}
                                            height={80}
                                            className="rounded-lg object-cover"
                                        />
                                        <div>
                                            <h3 className="text-lg font-bold text-white">{item.product.name}</h3>
                                            <p className="text-gray-400">
                                                Qty: {item.quantity} | ${item.price.toFixed(2)} each
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <p className="text-xl font-bold text-white mt-4">
                                    Total: <span className="text-orange-500">${order.total.toFixed(2)}</span>
                                </p>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserOrdersPage;