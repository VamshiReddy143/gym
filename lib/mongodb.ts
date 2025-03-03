import mongoose, { Mongoose } from "mongoose";

// Define the cached connection interface
interface CachedConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Extend the global namespace with proper typing
declare global {
  interface GlobalMongoose {
    mongoose?: CachedConnection;
  }
}

// Use unknown and type assertion to safely access global.mongoose
const cached: CachedConnection = (global as unknown as GlobalMongoose).mongoose || {
  conn: null,
  promise: null,
};

// Assign back to global for consistency (optional)
(global as unknown as GlobalMongoose).mongoose = cached;

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

async function dbConnect(): Promise<Mongoose> {
  // Return cached connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // If no connection promise exists, create one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable buffering if connection isn’t ready
      // Add other options as needed, e.g.:
      // connectTimeoutMS: 10000,
      // socketTimeoutMS: 45000,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        console.log("MongoDB connected successfully"); // Optional logging
        return mongooseInstance;
      })
      .catch((err) => {
        console.error("MongoDB connection error:", err);
        cached.promise = null; // Reset promise on failure to allow retry
        throw err; // Re-throw to propagate the error
      });
  }

  // Await and cache the connection
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;