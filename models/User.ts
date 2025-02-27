import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    googleId?: string;
    image?: string;
    name: string;
    email: string;
    password?: string;
    phonenumber?: number;
    Address?: string;
    isAdmin: boolean;
    role:string;
    gender?: string;
    subscription?: {
        planName: string;
        startDate: Date;
        endDate: Date;
        price: number;
        qrCode: string;
    };
    streak: number;
    points: number;
    lastChallengeDate: string;
    completedChallenges: string[];
    awards:string[],
    notifications: {
        message: string;
        createdAt: Date;
        sentBy: string; 
    }[];
    
}

const UserSchema = new Schema<IUser>({
    googleId: { type: String, unique: true, sparse: true },
    image: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    gender: { type: String },
    role: { type: String, enum: ["admin", "user", "trainer"], default: "user" },
    phonenumber: { type: Number },
    Address: { type: String },
    isAdmin: { type: Boolean, default: false },
    notifications: [
        {
            message: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
            sentBy: { type: String, required: true },
        },
    ],
    subscription: {
        planName: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        price: { type: Number },
        qrCode: { type: String },
    },
    streak: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    lastChallengeDate: { type: String, default: null },
    completedChallenges: { type: [String], default: [] },
    awards:{type:[String],default:[]}
},{
    timestamps: true,});

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
