import { Server } from "socket.io";
import http from "http";
import express from "express";
import mongoose from "mongoose";
import Message from "./models/Message.js";
import dotenv from "dotenv";


dotenv.config({ path: "./.env.local" }); 

const avatarImages = [
  "/avatar1.png", "/avatar2.png", "/avatar3.png", "/avatar4.png", "/avatar5.png",
  "/avatar6.png", "/avatar7.png", "/avatar8.png", "/avatar9.png", "/avatar10.png",
  "/avatar11.png", "/avatar12.png", "/avatar13.png", "/avatar14.png", "/avatar15.png",
  "/avatar16.png", "/avatar17.png", "/avatar18.png", "/avatar19.png", "/avatar20.png",
];

const getRandomAvatar = () => {
  const randomIndex = Math.floor(Math.random() * avatarImages.length);
  return avatarImages[randomIndex] || "/placeholder.png";
};

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  path: "/socket.io",
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Access MONGODB_URI and validate it
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Error: MONGODB_URI is not defined in the .env file");
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); 
  });

const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (room) => {
    socket.join(room);
    io.to(room).emit("userStatus", Array.from(onlineUsers.values()));
  });

  socket.on("message", async (data) => {
    const message = new Message({
      ...data,
      room: data.room,
      userName: data.userName,
      userId: data.userId,
      userImage: data.userImage || getRandomAvatar(),
      reactions: {},
      text: data.text || "",
      image: data.image || null,
      voice: data.voice || null,
      timestamp: new Date(),
    });

    const savedMessage = await message.save();
    const messageToEmit = { ...savedMessage.toObject(), id: savedMessage._id.toString() };
    io.to(data.room).emit("message", messageToEmit);

    // Update online users
    if (!onlineUsers.has(data.userId)) {
      onlineUsers.set(data.userId, {
        id: data.userId,
        name: data.userName,
        image: data.userImage,
        socketId: socket.id,
        online: true,
      });
      io.to(data.room).emit("userStatus", Array.from(onlineUsers.values()));
    }
  });

  socket.on("deleteMessage", async ({ id, room }) => {
    await Message.findByIdAndDelete(id);
    io.to(room).emit("messageDeleted", id);
  });

  socket.on("reaction", async ({ messageId, emoji, userId, room }) => {
    const message = await Message.findById(messageId);
    if (message) {
      const reactions = message.reactions || {};
      reactions[emoji] = reactions[emoji] || [];
      if (reactions[emoji].includes(userId)) {
        reactions[emoji] = reactions[emoji].filter((id) => id !== userId);
      } else {
        reactions[emoji].push(userId);
      }
      if (reactions[emoji].length === 0) delete reactions[emoji];
      message.reactions = reactions;
      await message.save();
      io.to(room).emit("reaction", { messageId, emoji, userId });
    }
  });

  socket.on("typing", ({ userId, isTyping, room }) => {
    socket.to(room).emit("typing", { userId, isTyping });
  });

  socket.on("disconnect", () => {
    const user = Array.from(onlineUsers.values()).find((u) => u.socketId === socket.id);
    if (user) {
      onlineUsers.delete(user.id);
      io.to("group1").emit("userStatus", Array.from(onlineUsers.values()));
    }
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.SOCKET_PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));