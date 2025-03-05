"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useSession } from "next-auth/react";
import NextImage from "next/image";
import Loading from "@/components/Loading";

// Types
interface Product {
  _id: string;
  name: string;
  image: string;
  price: number;
}

interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  user: { name: string; email: string };
  items: OrderItem[];
  total: number;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

// Constants
const STATUS_COLORS = {
  pending: "text-yellow-500",
  shipped: "text-orange-500",
  delivered: "text-green-500",
  cancelled: "text-red-500",
};

const ANIMATION_VARIANTS = {
  fadeIn: { opacity: 0, y: 50 },
  fadeInVisible: { opacity: 1, y: 0 },
};

const AdminOrdersPage: React.FC = () => {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    if (status === "loading" || !session?.user?.id || !session?.user?.isAdmin) {
      setIsLoading(false);
      setError("Unauthorized Access");
      return;
    }

    try {
      const { data } = await axios.get<{ success: boolean; orders: Order[] }>("/api/admin/orders");
      if (data.success) {
        setOrders(data.orders ?? []);
      } else {
        setError("Failed to fetch orders");
      }
    } catch (err) {
      setError("An error occurred while fetching orders");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [session, status]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Update order status
  const handleUpdateStatus = async (orderId: string, newStatus: Order["status"]) => {
    try {
      const { data } = await axios.put<{ success: boolean }>(`/api/admin/orders/${orderId}`, { status: newStatus });
      if (data.success) {
        setOrders((prev) =>
          prev.map((order) => (order._id === orderId ? { ...order, status: newStatus } : order))
        );
      } else {
        alert("Failed to update order status");
      }
    } catch (err) {
      console.error("Error updating order status:", err);
      alert("An error occurred while updating the order");
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  // Error or Unauthorized State
  if (error || !session?.user?.isAdmin) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <motion.p
          variants={ANIMATION_VARIANTS}
          initial="fadeIn"
          animate="fadeInVisible"
          transition={{ duration: 0.5 }}
          className="text-center text-red-500 text-lg sm:text-xl font-semibold"
          role="alert"
        >
          {error || "Unauthorized Access"}
        </motion.p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-8 py-12 sm:py-16 overflow-hidden relative">
      {/* SEO-friendly hidden heading */}
      <h1 className="sr-only">Admin Orders Dashboard</h1>

      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,0,0,0.2),_transparent_70%)] pointer-events-none opacity-50" />

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <motion.h1
          variants={ANIMATION_VARIANTS}
          initial="fadeIn"
          animate="fadeInVisible"
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center uppercase tracking-tight mb-8 sm:mb-12"
        >
          Admin <span className="text-orange-500">Orders</span>
        </motion.h1>

        {/* Orders List */}
        {orders.length === 0 ? (
          <motion.p
            variants={ANIMATION_VARIANTS}
            initial="fadeIn"
            animate="fadeInVisible"
            transition={{ duration: 0.5 }}
            className="text-center text-gray-400 text-lg sm:text-xl font-semibold"
          >
            No orders yet
          </motion.p>
        ) : (
          <section className="space-y-6 sm:space-y-8">
            {orders.map((order) => (
              <motion.article
                key={order._id}
                variants={ANIMATION_VARIANTS}
                initial="fadeIn"
                animate="fadeInVisible"
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:p-6 rounded-2xl border-2 border-red-900/50 shadow-[0_0_10px_rgba(255,0,0,0.2)]"
              >
                <h2 className="text-xl sm:text-2xl font-extrabold uppercase tracking-wide mb-3 sm:mb-4">
                  Order #{order._id.slice(-6)} -{" "}
                  <span className={STATUS_COLORS[order.status]}>{order.status}</span>
                </h2>
                <p className="text-gray-300 text-sm sm:text-base mb-2">
                  User: {order.user.name} ({order.user.email})
                </p>
                <p className="text-gray-300 text-sm sm:text-base mb-3 sm:mb-4">
                  Placed on: {new Date(order.createdAt).toLocaleDateString()}
                </p>

                {/* Order Items */}
                <div className="space-y-4 mb-4 sm:mb-6">
                  {order.items && order.items.map((item) => (
                    <div key={item.product._id} className="flex items-center gap-3 sm:gap-4">
                      <NextImage
                        src={item.product.image}
                        alt={`${item.product.name} image`}
                        width={60}
                        height={60}
                        className="rounded-lg object-cover"
                        loading="lazy"
                      />
                      <div>
                        <h3 className="text-base sm:text-lg font-bold">{item.product.name}</h3>
                        <p className="text-gray-400 text-sm sm:text-base">
                          Qty: {item.quantity} | ${item.price.toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <p className="text-lg sm:text-xl font-bold mt-4">
                  Total: <span className="text-orange-500">${order.total.toFixed(2)}</span>
                </p>

                {/* Action Buttons */}
                <div className="mt-4 sm:mt-6 flex flex-wrap gap-3 sm:gap-4">
                  {[
                    { label: "Mark as Shipped", status: "shipped", color: "bg-orange-500 hover:bg-orange-600" },
                    { label: "Mark as Delivered", status: "delivered", color: "bg-green-500 hover:bg-green-600" },
                    { label: "Cancel Order", status: "cancelled", color: "bg-red-500 hover:bg-red-600" },
                  ].map((action) => (
                    <motion.button
                      key={action.status}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleUpdateStatus(order._id, action.status as Order["status"])}
                      className={`px-3 sm:px-4 py-1 sm:py-2 ${action.color} text-white text-xs sm:text-sm font-bold uppercase rounded-full transition-all duration-300`}
                      disabled={order.status === action.status}
                      aria-label={`${action.label} for order ${order._id}`}
                    >
                      {action.label}
                    </motion.button>
                  ))}
                </div>
              </motion.article>
            ))}
          </section>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;