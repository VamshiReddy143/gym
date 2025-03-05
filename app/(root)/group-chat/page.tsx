"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPaperPlane, FaImage, FaSmile, FaTimes, FaTrash, FaMicrophone, FaStop } from "react-icons/fa";
import { useSession } from "next-auth/react";
import io, { Socket } from "socket.io-client";
import Image from "next/image";
import EmojiPicker from "emoji-picker-react";

// Types
export interface Message {
  _id?: string;
  id: string;
  room: string;
  userId: string;
  userName: string;
  userImage: string;
  text: string;
  image?: string | null;
  voice?: string | null;
  reactions: { [key: string]: string[] };
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
  image?: string;
  online?: boolean;
}

export type Theme = "dark" | "light" | "gym" | "blue" | "forest" | "pastel" | "neon";

// Utilities
const avatarImages = [
  "/avatar1.png", "/avatar2.png", "/avatar3.png", "/avatar4.png", "/avatar5.png",
  "/avatar6.png", "/avatar7.png", "/avatar8.png", "/avatar9.png", "/avatar10.png",
  "/avatar11.png", "/avatar12.png", "/avatar13.png", "/avatar14.png", "/avatar15.png",
  "/avatar16.png", "/avatar17.png", "/avatar18.png", "/avatar19.png", "/avatar20.png",
];

const getRandomAvatar = (): string => {
  const randomIndex = Math.floor(Math.random() * avatarImages.length);
  return avatarImages[randomIndex] || "/default-avatar.png";
};

// Skeleton Loader Component
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

const ChatSkeletonLoader: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      <SkeletonMessage />
      <SkeletonMessage isOwnMessage />
      <SkeletonMessage />
      <SkeletonMessage isOwnMessage />
      <SkeletonMessage />
    </div>
  );
};

// Message Item Component
const MessageItem: React.FC<{
  msg: Message;
  isOwnMessage: boolean;
  onDelete: (id: string) => void;
  onReact: (id: string, emoji: string) => void;
  setShowReactionPicker: (id: string | null) => void;
  showReactionPicker: string | null;
}> = ({ msg, isOwnMessage, onDelete, onReact, setShowReactionPicker, showReactionPicker }) => {
  const prevMsg = useRef<Message | null>(null);

  useEffect(() => {
    prevMsg.current = msg;
  }, [msg]);

  const messageId = msg._id || msg.id;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`mb-4 flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
    >
      <div className="flex items-center max-w-xs relative">
        {!isOwnMessage && (
          <motion.div whileHover={{ scale: 1.1 }} className="flex-shrink-0 mr-3">
            <Image
              src={msg.userImage}
              alt={msg.userName}
              width={36}
              height={36}
              className="rounded-full border-2 border-[var(--accent)] object-cover"
            />
          </motion.div>
        )}
        <div className={`flex flex-col ${isOwnMessage ? "items-end" : "items-start"}`}>
          <span className={`text-sm font-semibold text-[var(--accent)] mb-1 ${isOwnMessage ? "text-right" : "text-left"}`}>
            {msg.userName}
          </span>
          <div
            className={`p-3 rounded-xl shadow-md ${isOwnMessage ? "bg-[var(--accent)] text-white" : "bg-[var(--bg-secondary)] text-[var(--text-primary)]"}`}
            onContextMenu={(e) => {
              e.preventDefault();
              setShowReactionPicker(messageId);
            }}
          >
            {msg.text && <p className="break-words">{msg.text}</p>}
            {msg.image && <Image src={msg.image} alt="Shared" width={200} height={200} className="rounded-lg mt-2" />}
            {msg.voice && (
              <audio controls src={msg.voice} className="mt-2 w-full">
                Your browser does not support the audio element.
              </audio>
            )}
            <span className="text-xs text-gray-100 mt-1 block">
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
          {Object.keys(msg.reactions).length > 0 && (
            <div className={`flex gap-2 mt-1 flex-wrap ${isOwnMessage ? "justify-end" : "justify-start"}`}>
              {Object.entries(msg.reactions).map(([emoji, users]) => (
                <motion.span
                  key={emoji}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                  whileHover={{ scale: 1.2 }}
                  onClick={() => onReact(messageId, emoji)}
                  className="cursor-pointer bg-[var(--bg-secondary)] px-2 py-1 rounded-full text-sm text-[var(--text-primary)] shadow-md"
                >
                  {emoji} {users.length}
                </motion.span>
              ))}
            </div>
          )}
          {isOwnMessage && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => onDelete(messageId)}
              className="absolute -top-2 -right-2 text-red-500"
            >
              <FaTrash size={16} />
            </motion.button>
          )}
        </div>
        {isOwnMessage && (
          <motion.div whileHover={{ scale: 1.1 }} className="flex-shrink-0 ml-3">
            <Image
              src={msg.userImage}
              alt={msg.userName}
              width={36}
              height={36}
              className="rounded-full border-2 border-[var(--accent)] object-cover"
            />
          </motion.div>
        )}
      </div>
      <AnimatePresence>
        {showReactionPicker === messageId && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute z-20 bottom-12 bg-[var(--bg-secondary)] rounded-lg shadow-lg"
          >
            <EmojiPicker
              onEmojiClick={(emoji) => onReact(messageId, emoji.emoji)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Input Area Component
const InputArea: React.FC<{
  newMessage: string;
  setNewMessage: (val: string) => void;
  previewImage: string | null;
  setPreviewImage: (val: string | null) => void;
  voicePreview: string | null;
  setVoicePreview: (val: string | null) => void;
  showEmojiPicker: boolean;
  setShowEmojiPicker: (val: boolean) => void;
  onSend: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVoiceRecord: () => void;
  onVoiceSend: () => void;
  onVoiceCancel: () => void;
  isRecording: boolean;
}> = ({
  newMessage,
  setNewMessage,
  previewImage,
  setPreviewImage,
  voicePreview,
  showEmojiPicker,
  setShowEmojiPicker,
  onSend,
  onImageUpload,
  onVoiceRecord,
  onVoiceSend,
  onVoiceCancel,
  isRecording,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="p-4 bg-[var(--bg-secondary)] border-t border-gray-700 flex flex-col gap-3 sticky bottom-0 z-10">
      {previewImage && (
        <div className="relative w-12 h-12 flex-shrink-0">
          <Image src={previewImage} alt="Preview" layout="fill" objectFit="cover" className="rounded" />
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => setPreviewImage(null)}
            className="absolute top-0 right-0 bg-red-500 p-1 rounded-full"
          >
            <FaTimes size={10} />
          </motion.button>
        </div>
      )}
      {voicePreview && (
        <div className="flex items-center gap-2">
          <audio controls src={voicePreview} className="w-48" />
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={onVoiceSend}
            className="p-2 bg-[var(--accent)] rounded-full text-white"
          >
            <FaPaperPlane size={16} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={onVoiceCancel}
            className="p-2 bg-red-500 rounded-full text-white"
          >
            <FaTimes size={16} />
          </motion.button>
        </div>
      )}
      {!voicePreview && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 rounded-xl bg-[var(--bg-primary)] text-[var(--text-primary)] border border-gray-600 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
            onKeyPress={(e) => e.key === "Enter" && onSend()}
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 text-[var(--accent)]"
          >
            <FaSmile size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-[var(--accent)]"
          >
            <FaImage size={20} />
          </motion.button>
          <input
            ref={fileInputRef}
            type="file"
            onChange={onImageUpload}
            accept="image/*"
            className="hidden"
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={onVoiceRecord}
            className={`p-2 ${isRecording ? "text-red-500" : "text-[var(--accent)]"}`}
          >
            {isRecording ? <FaStop size={20} /> : <FaMicrophone size={20} />}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={onSend}
            className="p-2 bg-[var(--accent)] rounded-full text-white shadow-md"
            disabled={isRecording}
          >
            <FaPaperPlane size={20} />
          </motion.button>
        </div>
      )}
      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-20 left-4 bg-[var(--bg-secondary)] rounded-lg shadow-lg z-20 p-2"
          >
            <div className="flex justify-end mb-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => setShowEmojiPicker(false)}
                className="text-gray-400 hover:text-[var(--accent)]"
              >
                <FaTimes size={18} />
              </motion.button>
            </div>
            <EmojiPicker
              onEmojiClick={(emoji) => {
                setNewMessage(newMessage + emoji.emoji);
                setShowEmojiPicker(false);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Main Chat Page
const GroupChatPage: React.FC = () => {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [voicePreview, setVoicePreview] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [room] = useState<string>("group1");
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [showReactionPicker, setShowReactionPicker] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [theme, setTheme] = useState<Theme>("dark");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Added loading state
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme) setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme || "dark");

    const fetchMessages = async () => {
      try {
        setIsLoading(true); // Start loading
        const res = await fetch(`/api/messages?room=${room}`);
        const data = await res.json();
        if (data.success) {
          setMessages(
            data.messages.map((msg: Message) => ({
              ...msg,
              id: msg._id || msg.id,
              reactions: msg.reactions || {},
              userImage: msg.userImage || getRandomAvatar(),
            }))
          );
          setTimeout(scrollToBottom, 100);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsLoading(false); // End loading
      }
    };
    fetchMessages();

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "https://fitnass.onrender.com"
    const newSocket = io(socketUrl, {
      path: "/socket.io",
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 10,
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connected, ID:", newSocket.id, "Session user ID:", session?.user?.id);
      newSocket.emit("join", room);
    });

    newSocket.on("message", (message: Message) => {
      setMessages((prev) => [
        ...prev,
        {
          ...message,
          id: message._id || message.id,
          userImage: message.userImage || getRandomAvatar(),
        },
      ]);
      setTimeout(scrollToBottom, 100);
    });

    newSocket.on("messageDeleted", (id: string) => {
      setMessages((prev) => prev.filter((msg) => (msg._id || msg.id) !== id));
    });

    newSocket.on("reaction", ({ messageId, emoji, userId }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          (msg._id || msg.id) === messageId
            ? {
                ...msg,
                reactions: {
                  ...msg.reactions,
                  [emoji]: msg.reactions[emoji]?.includes(userId)
                    ? msg.reactions[emoji].filter((id: string) => id !== userId)
                    : [...(msg.reactions[emoji] || []), userId],
                },
              }
            : msg
        )
      );
    });

    newSocket.on("typing", ({ userId, isTyping }) => {
      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        if (isTyping) {
          newSet.add(userId);
        } else {
          newSet.delete(userId);
        }
        return newSet;
      });
    });

    newSocket.on("userStatus", (onlineUsers: User[]) => {
      setUsers(onlineUsers);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [room, session?.user?.id]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current;
      chatContainerRef.current.scrollTop = scrollHeight - clientHeight;
    }
  };

  const handleSendMessage = () => {
    if ((!newMessage.trim() && !previewImage) || !socket || !session?.user) return;

    const message: Message = {
      room,
      text: newMessage,
      image: previewImage,
      userName: session.user.name || "Anonymous",
      userId: session.user.id,
      userImage: session.user.image || getRandomAvatar(),
      timestamp: new Date().toISOString(),
      reactions: {},
      id: Date.now().toString(),
    };

    socket.emit("message", message);
    setNewMessage("");
    setPreviewImage(null);
    setShowEmojiPicker(false);
  };

  const handleDeleteMessage = (id: string) => {
    if (socket) {
      console.log("Deleting message with ID:", id);
      socket.emit("deleteMessage", { id, room });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleVoiceRecord = async () => {
    if (!socket || !session?.user) return;

    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        const chunks: Blob[] = [];

        recorder.ondataavailable = (e) => chunks.push(e.data);
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/webm" });
          const reader = new FileReader();
          reader.onloadend = () => setVoicePreview(reader.result as string);
          reader.readAsDataURL(blob);
          stream.getTracks().forEach((track) => track.stop());
        };

        recorder.start();
        setMediaRecorder(recorder);
        setIsRecording(true);
      } catch (error) {
        console.error("Error recording voice:", error);
      }
    } else {
      mediaRecorder?.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const handleVoiceSend = () => {
    if (!socket || !session?.user || !voicePreview) return;

    const message: Message = {
      room,
      text: "",
      voice: voicePreview,
      userName: session.user.name || "Anonymous",
      userId: session.user.id,
      userImage: session.user.image || getRandomAvatar(),
      timestamp: new Date().toISOString(),
      reactions: {},
      id: Date.now().toString(),
    };

    socket.emit("message", message);
    setVoicePreview(null);
  };

  const handleVoiceCancel = () => {
    setVoicePreview(null);
    setIsRecording(false);
    setMediaRecorder(null);
  };

  const handleReaction = (messageId: string, emoji: string) => {
    if (!socket || !session?.user) return;
    socket.emit("reaction", { messageId, emoji, userId: session.user.id, room });
    setShowReactionPicker(null);
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <div id="chat-page" className="flex flex-col h-screen text-primary mb-[4em] sm:mb-0 lg:mb-0 font-sans overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-secondary shadow-lg flex items-center justify-between sticky mt-5 top-2 z-10">
        <h1 className="text-2xl font-bold accent uppercase tracking-wider">Gym Chat</h1>
        <div className="flex gap-2">
          <select
            value={theme}
            onChange={(e) => handleThemeChange(e.target.value as Theme)}
            className="p-1 rounded bg-primary text-primary border border-gray-600"
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="gym">Gym</option>
            <option value="blue">blue</option>
            <option value="forest">forest</option>
            <option value="pastel">pastel</option>
            <option value="neon">neon</option>
          </select>
          <div className="text-sm">
            Online: {users.filter((u) => u.online).length}/{users.length}
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--accent)] scrollbar-track-[var(--bg-secondary)] p-4 bg-primary"
      >
        {isLoading ? (
          <ChatSkeletonLoader />
        ) : messages.length === 0 ? (
          <div className="text-center text-[var(--text-primary)] p-4">No messages yet. Start chatting!</div>
        ) : (
          messages.map((msg) => (
            <MessageItem
              key={msg._id || msg.id}
              msg={msg}
              isOwnMessage={msg.userId === session?.user?.id}
              onDelete={handleDeleteMessage}
              onReact={handleReaction}
              setShowReactionPicker={setShowReactionPicker}
              showReactionPicker={showReactionPicker}
            />
          ))
        )}
        {typingUsers.size > 0 && (
          <div className="text-gray-400 text-sm italic">Someone is typing...</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {session && (
        <InputArea
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          previewImage={previewImage}
          setPreviewImage={setPreviewImage}
          voicePreview={voicePreview}
          setVoicePreview={setVoicePreview}
          showEmojiPicker={showEmojiPicker}
          setShowEmojiPicker={setShowEmojiPicker}
          onSend={handleSendMessage}
          onImageUpload={handleImageUpload}
          onVoiceRecord={handleVoiceRecord}
          onVoiceSend={handleVoiceSend}
          onVoiceCancel={handleVoiceCancel}
          isRecording={isRecording}
        />
      )}
    </div>
  );
};

export default GroupChatPage;