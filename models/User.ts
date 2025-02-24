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
  
}

const UserSchema = new Schema<IUser>({
    googleId: { type: String, unique: true, sparse: true },
    image: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    phonenumber: { type: Number },
    Address: { type: String },
    isAdmin: { type: Boolean, default: false },
    
});

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
