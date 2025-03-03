import React from "react";
import { motion } from "framer-motion";

// Skeleton Message Component
const SkeletonMessage: React.FC<{ isOwnMessage?: boolean }> = ({ isOwnMessage = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`mb-4 flex ${isOwnMessage ? "justify-end" : "justify-start"} animate-pulse`}
    >
      <div className="flex items-start max-w-xs">
        {!isOwnMessage && (
          <div className="w-9 h-9 bg-[var(--bg-secondary)] rounded-full mr-3" />
        )}
        <div className={`flex flex-col ${isOwnMessage ? "items-end" : "items-start"}`}>
          <div className="w-20 h-3 bg-[var(--bg-secondary)] rounded mb-2" />
          <div
            className={`p-3 rounded-xl ${
              isOwnMessage ? "bg-[var(--accent)]" : "bg-[var(--bg-secondary)]"
            }`}
          >
            <div className="w-32 h-4 bg-[var(--bg-primary)] rounded" />
            <div className="w-16 h-2 bg-[var(--bg-primary)] rounded mt-2" />
          </div>
        </div>
        {isOwnMessage && (
          <div className="w-9 h-9 bg-[var(--bg-secondary)] rounded-full ml-3" />
        )}
      </div>
    </motion.div>
  );
};

// Full Skeleton Loader for Chat Page
export const ChatSkeletonLoader: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {/* Alternating messages to mimic a real chat */}
      <SkeletonMessage />
      <SkeletonMessage isOwnMessage />
      <SkeletonMessage />
      <SkeletonMessage isOwnMessage />
      <SkeletonMessage />
    </div>
  );
};

export default ChatSkeletonLoader;