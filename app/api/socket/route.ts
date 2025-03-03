import {  NextResponse } from "next/server";
import { Server, Socket } from "socket.io";
import { Server as HTTPServer } from "http";


// Define interfaces for Socket.IO events
interface ServerToClientEvents {
    userJoined: (message: string) => void;
    message: (data: {
        id: string;
        userId: string;
        text: string;
        image: string | null;
        reactions: Record<string, string[]>;
        timestamp: string;
    }) => void;
    reaction: (data: {
        messageId: string;
        emoji: string;
        userId: string;
        room: string;
    }) => void;
}

interface ClientToServerEvents {
    join: (room: string) => void;
    message: (data: { room: string; text: string; image?: string }) => void;
    reaction: (data: { messageId: string; emoji: string; userId: string; room: string }) => void;
}


// Type for io
let io: Server<ClientToServerEvents, ServerToClientEvents> | undefined;

// Extend NextResponse to include socket.server (for TypeScript)
interface SocketNextResponse extends NextResponse {
    socket: {
        server: HTTPServer;
    };
}

export async function GET() {
    // Create a plain NextResponse
    const res = new NextResponse("Socket.IO server initialized", { status: 200 });

    // Check if io is already initialized
    if (!io) {
        // Use the underlying HTTP server from Next.js
        const httpServer = (res as unknown as SocketNextResponse).socket.server;
        io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
            path: "/api/socket",
            cors: { origin: "*" }, // Adjust for production
        });

        io.on("connection", (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
            console.log("User connected:", socket.id);

            // Join group chat room
            socket.on("join", (room: string) => {
                socket.join(room);
                socket.to(room).emit("userJoined", `${socket.id} joined the chat`);
            });

            // Handle messages
            socket.on("message", (data: { room: string; text: string; image?: string }) => {
                io?.to(data.room).emit("message", {
                    id: Date.now().toString(),
                    userId: socket.id,
                    text: data.text,
                    image: data.image || null,
                    reactions: {},
                    timestamp: new Date().toISOString(),
                });
            });

            // Handle emoji reactions
            socket.on("reaction", (data: { messageId: string; emoji: string; userId: string; room: string }) => {
                io?.to(data.room).emit("reaction", data);
            });

            socket.on("disconnect", () => {
                console.log("User disconnected:", socket.id);
            });
        });
    }

    return res;
}