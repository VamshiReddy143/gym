"use client";

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
import { Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GymmyLoading from "./GymmyLoading";

interface GymmyProps {
    onClose: () => void;
}

const Gymmy: React.FC<GymmyProps> = ({ onClose }) => {
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const simulateTyping = async (text: string, callback: (typedText: string) => void) => {
        let typedText = "";
        for (const char of text) {
            typedText += char;
            callback(typedText);
            await new Promise((resolve) => setTimeout(resolve, 30)); // Natural typing speed
        }
    };

    const formatBotResponse = (rawText: string): string => {
        // Ensure single-line output by removing newlines and markdown
        return rawText.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\n\s*\n/g, " ").replace(/\n/g, " ").trim();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = `You: ${input}`;
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await axios.post(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent",
                {
                    contents: [{ parts: [{ text: input }] }],
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "x-goog-api-key": process.env.NEXT_PUBLIC_GEMINI_API_KEY,
                    },
                }
            );

            let botReply = response.data.candidates[0].content.parts[0].text;
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
            console.error("Error:", error);
            setMessages((prev) => [...prev, "Bot: Oops, something broke! Try again."]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed bottom-20 right-5 w-96 md:w-[28rem] h-[32rem] bg-gradient-to-br from-gray-900 to-gray-800 shadow-[0_0_30px_rgba(255,165,0,0.6)] rounded-3xl border-2 border-orange-600/60 overflow-hidden z-[1000] flex flex-col"
        >
            {/* Header */}
            <motion.div
                className="flex justify-between items-center p-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-t-3xl shadow-[0_4px_15px_rgba(0,0,0,0.4)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                <h2 className="text-xl md:text-2xl font-extrabold uppercase tracking-wider text-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                    Gymmy Chat
                </h2>
                <motion.button
                    whileHover={{ scale: 1.2, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="text-white hover:text-gray-200 transition-colors"
                >
                    <FaTimes size={24} />
                </motion.button>
            </motion.div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-800/90 backdrop-blur-md scrollbar-thin scrollbar-thumb-orange-600/50 scrollbar-track-gray-900">
                <AnimatePresence>
                    {messages.map((msg, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className={`p-4 my-3 rounded-2xl max-w-[85%] shadow-[0_2px_10px_rgba(0,0,0,0.3)] text-sm md:text-base font-medium ${
                                msg.startsWith("You:")
                                    ? "bg-gradient-to-r from-red-500 to-orange-500 text-white ml-auto"
                                    : "bg-gradient-to-r from-gray-700 to-gray-600 text-gray-100"
                            }`}
                        >
                            {msg}
                        </motion.div>
                    ))}
                </AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-4 my-3 rounded-2xl max-w-[85%] bg-gray-700/50 flex justify-center"
                    >
                        <GymmyLoading />
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Field */}
            <form
                onSubmit={handleSubmit}
                className="flex items-center p-4 border-t-2 border-orange-600/60 bg-gray-900/90 backdrop-blur-md"
            >
                <motion.input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask Gymmy anything..."
                    whileFocus={{ scale: 1.02, boxShadow: "0 0 15px rgba(255,165,0,0.4)" }}
                    className="flex-1 p-3 text-white bg-gray-800/60 border-2 border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 placeholder-gray-500 font-medium"
                />
                <motion.button
                    type="submit"
                    whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(255,165,0,0.6)" }}
                    whileTap={{ scale: 0.9 }}
                    disabled={isLoading}
                    className="ml-4 p-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl shadow-[0_2px_15px_rgba(255,0,0,0.5)] hover:from-red-700 hover:to-orange-700 transition-all duration-300"
                >
                    <Send size={20} />
                </motion.button>
            </form>
        </motion.div>
    );
};

export default Gymmy;