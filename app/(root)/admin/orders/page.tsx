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
    user: { name: string; email: string };
    items: OrderItem[];
    total: number;
    status: string;
    createdAt: string;
}

const AdminOrdersPage = () => {
    const { data: session } = useSession();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
          if (!session || !session.user?.id || !session.user.isAdmin) {
            setLoading(false); 
            setError("Unauthorized Access");
            return;
          }
          try {
            const response = await axios.get("/api/admin/orders");
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

    const handleUpdateStatus = async (orderId: string, status: string) => {
        try {
            const response = await axios.put(`/api/admin/orders/${orderId}`, { status });
            if (response.data.success) {
                setOrders((prev) =>
                    prev.map((order) => (order._id === orderId ? { ...order, status } : order))
                );
            } else {
                alert("Failed to update order status");
            }
        } catch (error) {
            console.error("Error updating order status:", error);
            alert("An error occurred while updating the order");
        }
    };

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

    if (!session?.user?.isAdmin) {
        return (
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center text-red-500 text-xl font-semibold min-h-screen flex justify-center items-center bg-black"
            >
                Unauthorized Access
            </motion.p>
        );
    }

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
                    Admin <span className="text-orange-500">Orders</span>
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
                                <p className="text-gray-300 mb-2">
                                    User: {order.user.name} ({order.user.email})
                                </p>
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
                                <div className="mt-6 flex gap-4">
                                    <motion.button
                                        whileHover={{ scale: 1.05, boxShadow: "0 0 10px rgba(255,165,0,0.5)" }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleUpdateStatus(order._id, "shipped")}
                                        className="px-4 py-2 bg-orange-500 text-white text-sm font-bold uppercase rounded-full hover:bg-orange-600 transition-all duration-300"
                                    >
                                        Mark as Shipped
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05, boxShadow: "0 0 10px rgba(0,255,0,0.5)" }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleUpdateStatus(order._id, "delivered")}
                                        className="px-4 py-2 bg-green-500 text-white text-sm font-bold uppercase rounded-full hover:bg-green-600 transition-all duration-300"
                                    >
                                        Mark as Delivered
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05, boxShadow: "0 0 10px rgba(255,0,0,0.5)" }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleUpdateStatus(order._id, "cancelled")}
                                        className="px-4 py-2 bg-red-500 text-white text-sm font-bold uppercase rounded-full hover:bg-red-600 transition-all duration-300"
                                    >
                                        Cancel Order
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrdersPage;