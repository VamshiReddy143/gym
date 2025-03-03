"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
import { Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GymmyLoading from "./GymmyLoading";

// Props Interface
interface GymmyProps {
  onClose: () => void;
}

// Constants
const ANIMATION_VARIANTS = {
  container: { initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 50 }, transition: { duration: 0.5, ease: "easeOut" } },
  header: { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.2, duration: 0.5 } },
  message: { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.3 } },
  loading: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
};

const Gymmy: React.FC<GymmyProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to Bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Simulate Typing Effect
  const simulateTyping = useCallback(async (text: string, callback: (typedText: string) => void) => {
    let typedText = "";
    for (const char of text) {
      typedText += char;
      callback(typedText);
      await new Promise((resolve) => setTimeout(resolve, 30)); // Adjustable typing speed
    }
  }, []);

  // Format Bot Response
  const formatBotResponse = useCallback((rawText: string): string => {
    return rawText.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\n\s*\n/g, " ").replace(/\n/g, " ").trim();
  }, []);

  // Handle Submit
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || isLoading) return;

      const userMessage = `You: ${input}`;
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);

      try {
        const response = await axios.post(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent",
          { contents: [{ parts: [{ text: input }] }] },
          {
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": process.env.NEXT_PUBLIC_GEMINI_API_KEY,
            },
          }
        );

        const botReply = response.data.candidates[0].content.parts[0].text;
        const formattedReply = formatBotResponse(botReply);

        await simulateTyping(formattedReply, (typedText) => {
          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage && lastMessage.startsWith("Bot: ")) {
              return [...prev.slice(0, -1), `Bot: ${typedText}`];
            }
            return [...prev, `Bot: ${typedText}`];
          });
        });
      } catch (error) {
        console.error("Error fetching bot response:", error);
        setMessages((prev) => [...prev, "Bot: Oops, something broke! Try again."]);
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, formatBotResponse, simulateTyping]
  );

  return (
    <motion.div
      {...ANIMATION_VARIANTS.container}
      className="fixed bottom-20 right-2 sm:right-5 w-80 sm:w-96 md:w-[28rem] h-[32rem] bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border-2 border-orange-600/60 overflow-hidden z-[1000] flex flex-col"
    >
      {/* Header */}
      <motion.div
        {...ANIMATION_VARIANTS.header}
        className="flex justify-between items-center p-3 sm:p-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-t-2xl"
      >
        <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold uppercase tracking-wider">Gymmy Chat</h2>
        <motion.button
          whileHover={{ scale: 1.2, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors"
          aria-label="Close Gymmy Chat"
        >
          <FaTimes size={20} />
        </motion.button>
      </motion.div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-gray-800/90 backdrop-blur-md scrollbar-thin scrollbar-thumb-orange-600/50 scrollbar-track-gray-900">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              {...ANIMATION_VARIANTS.message}
              className={`p-3 sm:p-4 my-2 sm:my-3 rounded-xl sm:rounded-2xl max-w-[85%] text-sm sm:text-base font-medium ${
                msg.startsWith("You:") ? "bg-gradient-to-r from-red-500 to-orange-500 text-white ml-auto" : "bg-gradient-to-r from-gray-700 to-gray-600 text-gray-100"
              }`}
            >
              {msg}
            </motion.div>
          ))}
          {isLoading && (
            <motion.div {...ANIMATION_VARIANTS.loading} className="p-3 sm:p-4 my-2 sm:my-3 rounded-xl sm:rounded-2xl max-w-[85%] bg-gray-700/50 flex justify-center">
              <GymmyLoading />
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <form onSubmit={handleSubmit} className="flex items-center p-3 sm:p-4 border-t-2 border-orange-600/60 bg-gray-900/90 backdrop-blur-md">
        <motion.input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Gymmy anything..."
          whileFocus={{ scale: 1.02 }}
          className="flex-1 p-2 sm:p-3 text-white bg-gray-800/60 border-2 border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 placeholder-gray-500 font-medium"
          aria-label="Chat input"
          disabled={isLoading}
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          disabled={isLoading}
          className="ml-2 sm:ml-4 p-2 sm:p-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl hover:from-red-700 hover:to-orange-700 transition-all duration-300 disabled:opacity-50"
          aria-label="Send message"
        >
          <Send size={18} />
        </motion.button>
      </form>
    </motion.div>
  );
};

export default Gymmy;