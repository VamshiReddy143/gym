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

// Animation Variants
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
  const [position, setPosition] = useState({ x: window.innerWidth - 400, y: window.innerHeight - 600 }); // Initial position (top-right)
  const [isDragging, setIsDragging] = useState(false);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);

  // Scroll to Bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Dragging Handlers
  const startDragging = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    dragStartPos.current = { x: clientX - position.x, y: clientY - position.y };
  }, [position]);

  const onDrag = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging || !dragStartPos.current) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const newX = clientX - dragStartPos.current.x;
    const newY = clientY - dragStartPos.current.y;

    // Boundary constraints
    const maxX = window.innerWidth - (chatRef.current?.offsetWidth || 400);
    const maxY = window.innerHeight - (chatRef.current?.offsetHeight || 600);
    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY)),
    });
  }, [isDragging]);

  const stopDragging = useCallback(() => {
    setIsDragging(false);
    dragStartPos.current = null;
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", onDrag);
      window.addEventListener("mouseup", stopDragging);
      window.addEventListener("touchmove", onDrag);
      window.addEventListener("touchend", stopDragging);
    }
    return () => {
      window.removeEventListener("mousemove", onDrag);
      window.removeEventListener("mouseup", stopDragging);
      window.removeEventListener("touchmove", onDrag);
      window.removeEventListener("touchend", stopDragging);
    };
  }, [isDragging, onDrag, stopDragging]);

  // Simulate Typing Effect
  const simulateTyping = useCallback(async (text: string, callback: (typedText: string) => void) => {
    let typedText = "";
    for (const char of text) {
      typedText += char;
      callback(typedText);
      await new Promise((resolve) => setTimeout(resolve, 30));
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
      ref={chatRef}
      style={{
        position: "fixed",
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: "20rem", // Adjusted for consistency
        height: "32rem",
        zIndex: 1000,
      }}
      className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border-2 border-orange-600/60 overflow-hidden flex flex-col shadow-[0_0_20px_rgba(255,165,0,0.4)]"
    >
      {/* Draggable Header */}
      <motion.div
        {...ANIMATION_VARIANTS.header}
        onMouseDown={startDragging}
        onTouchStart={startDragging}
        className="flex justify-between items-center p-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-t-2xl cursor-move"
      >
        <h2 className="text-xl font-extrabold uppercase tracking-wider">Gymmy Chat</h2>
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
      <div className="flex-1 overflow-y-auto p-4 bg-gray-800/90 backdrop-blur-md scrollbar-thin scrollbar-thumb-orange-600/50 scrollbar-track-gray-900">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              {...ANIMATION_VARIANTS.message}
              className={`p-3 my-2 rounded-2xl max-w-[85%] text-sm font-medium ${
                msg.startsWith("You:") ? "bg-gradient-to-r from-red-500 to-orange-500 text-white ml-auto" : "bg-gradient-to-r from-gray-700 to-gray-600 text-gray-100"
              }`}
            >
              {msg}
            </motion.div>
          ))}
          {isLoading && (
            <motion.div {...ANIMATION_VARIANTS.loading} className="p-3 my-2 rounded-2xl max-w-[85%] bg-gray-700/50 flex justify-center">
              <GymmyLoading />
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <form onSubmit={handleSubmit} className="flex items-center p-4 border-t-2 border-orange-600/60 bg-gray-900/90 backdrop-blur-md">
        <motion.input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Gymmy anything..."
          whileFocus={{ scale: 1.02 }}
          className="flex-1 p-3 text-white bg-gray-800/60 border-2 border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 placeholder-gray-500 font-medium"
          aria-label="Chat input"
          disabled={isLoading}
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          disabled={isLoading}
          className="ml-4 p-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl hover:from-red-700 hover:to-orange-700 transition-all duration-300 disabled:opacity-50"
          aria-label="Send message"
        >
          <Send size={18} />
        </motion.button>
      </form>
    </motion.div>
  );
};

// Parent Component to Toggle Chatbot
const ChatbotToggle: React.FC = () => {
  const [showChatbot, setShowChatbot] = useState(false);

  return (
    <>
      {/* Desktop Button */}
      <motion.button
        whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255,165,0,0.6)" }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowChatbot((prev) => !prev)}
        className="hidden md:flex border-2 border-red-600 text-white p-1 sm:px-1 sm:py-2 md:px-3 md:py-1 rounded-full bg-gradient-to-r from-red-600/20 to-orange-600/20 hover:from-red-600/30 hover:to-orange-600/30 transition-all duration-300 text-sm md:text-base lg:text-lg font-bold uppercase tracking-wide fixed bottom-5 right-5 z-[999]"
      >
        ✨ AI
      </motion.button>
      {/* Mobile Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowChatbot((prev) => !prev)}
        className="md:hidden border-2 border-red-600 text-white px-2 py-1 rounded-full bg-red-600/20 hover:bg-orange-600/30 transition-all duration-300 text-sm fixed bottom-5 right-5 z-[999]"
      >
        ✨
      </motion.button>

      {/* Chatbot */}
      <AnimatePresence>
        {showChatbot && <Gymmy onClose={() => setShowChatbot(false)} />}
      </AnimatePresence>
    </>
  );
};

export default ChatbotToggle;