import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
import { div } from "framer-motion/client";
import GymmyLoading from "./GymmyLoading";
import { Send } from "lucide-react";

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
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
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

      // Remove markdown-style bold formatting (**bold text** → bold text)
      botReply = botReply.replace(/\*\*(.*?)\*\*/g, "$1");

      await simulateTyping(botReply, (typedText) => {
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
      setMessages((prev) => [...prev, "Bot: Sorry, something went wrong!"]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-[15em] right-5 w-80 h-96 border-orange-500 bg-gray-700 shadow-2xl rounded-lg border z-[1000] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-3 bg-orange-600 text-white rounded-t-lg">
        <h2 className="text-lg font-semibold">Gymmy Chat</h2>
        <button onClick={onClose} className="text-white hover:text-gray-200">
          <FaTimes />
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 my-1 rounded-lg max-w-[80%] text-sm ${
              msg.startsWith("You:") ? "bg-red-500 text-white self-end text-left" : "bg-gray-600 text-gray-100 self-start text-left"
            }`}
          >
            {msg}
          </div>
        ))}
        {isLoading && (
          <div className="p-2 my-1 rounded-lg max-w-[80%] ">
             <GymmyLoading/>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <form className="flex p-2 border-t border-gray-300" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 text-white border bg-transparent border-gray-300 rounded-lg focus:outline-none  "
        />
        <button
          type="submit"
          className="ml-2 p-2 bg-red-500 text-white rounded-lg"
        >
          <Send/>
        </button>
      </form>
    </div>
  );
};

export default Gymmy;
