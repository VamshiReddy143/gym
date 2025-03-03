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
  items: OrderItem[];
  total: number;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

// Constants
const ANIMATION_VARIANTS = {
  header: { initial: { opacity: 0, y: -50 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, ease: "easeOut" } },
  message: { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.5 } },
  order: { initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, ease: "easeOut" } },
};

const STATUS_COLORS = {
  pending: "text-yellow-500",
  shipped: "text-orange-500",
  delivered: "text-green-500",
  cancelled: "text-red-500",
};

const UserOrdersPage: React.FC = () => {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Orders
  const fetchOrders = useCallback(async () => {
    if (status === "loading" || !session?.user?.id) return;
    setLoading(true);
    try {
      const { data } = await axios.get<{ success: boolean; orders: Order[] }>("/api/orders/user");
      if (data.success) {
        setOrders(data.orders ?? []);
      } else {
        setError("Failed to fetch orders");
      }
    } catch (err) {
      setError("An error occurred while fetching orders");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [session, status]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <motion.p
          {...ANIMATION_VARIANTS.message}
          className="text-center text-red-500 text-lg sm:text-xl font-semibold"
          role="alert"
        >
          {error}
        </motion.p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-8 py-12 sm:py-16 overflow-hidden relative">
      {/* SEO-friendly hidden heading */}
      <h1 className="sr-only">Your Orders</h1>

      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,0,0,0.2),_transparent_70%)] pointer-events-none opacity-50" />

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <motion.h1
          {...ANIMATION_VARIANTS.header}
          className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-center uppercase tracking-tight mb-8 sm:mb-12"
        >
          Your <span className="text-orange-500">Orders</span>
        </motion.h1>

        {/* Orders List */}
        {orders.length === 0 ? (
          <motion.p
            {...ANIMATION_VARIANTS.message}
            className="text-center text-gray-400 text-lg sm:text-xl font-semibold"
          >
            No orders yet
          </motion.p>
        ) : (
          <section className="space-y-6 sm:space-y-8">
            {orders.map((order) => (
              <motion.article
                key={order._id}
                {...ANIMATION_VARIANTS.order}
                className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:p-6 rounded-2xl border-2 border-red-900/50 shadow-[0_0_15px_rgba(255,0,0,0.3)]"
              >
                <h2 className="text-xl sm:text-2xl font-extrabold uppercase tracking-wide mb-3 sm:mb-4">
                  Order #{order._id.slice(-6)} - <span className={STATUS_COLORS[order.status]}>{order.status}</span>
                </h2>
                <p className="text-gray-300 text-sm sm:text-base mb-3 sm:mb-4">
                  Placed on: {new Date(order.createdAt).toLocaleDateString()}
                </p>

                {/* Order Items */}
                <div className="space-y-4 mb-4 sm:mb-6">
                  {order.items.map((item) => (
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
              </motion.article>
            ))}
          </section>
        )}
      </div>
    </div>
  );
};

export default UserOrdersPage;