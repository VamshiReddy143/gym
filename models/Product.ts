// models/Product.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
    name: string;
    image: string;
    price: number;
    description: string;
    category: "bulk" | "cut" | "items" | "supplements" | "accessories";
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        description: { type: String, required: true },
        category: {
            type: String,
            required: true,
            enum: ["bulk", "cut", "items", "supplements", "accessories"],
        },
    },
    { timestamps: true }
);

console.log("Registering Product model..."); // Debug log
const Product = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
console.log("Product model registered"); // Confirm registration

export default Product;