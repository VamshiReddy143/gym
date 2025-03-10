import mongoose from "mongoose";
import  { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

interface MongooseCache {
  conn: mongoose.Mongoose | null;
  promise: Promise<mongoose.Mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache;
}


declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      _id?: string; // MongoDB-style ID
      sub?: string; // OAuth subject ID (e.g., from JWT)
      isAdmin?: boolean;
      isAdmin: boolean;
    } & DefaultSession["user"];
  }

}



interface User extends DefaultUser {
  id: string;
  _id?: string;
    sub?: string;
  isAdmin?: boolean;
  subscription?: {
    planName: string;
    startDate: Date;
    endDate: Date;
    price: number;
    qrCode: string;
  };
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    isAdmin: boolean;
  }
}

export {};
