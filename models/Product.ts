import mongoose, { Schema, Document } from "mongoose";

interface IProduct extends Document {
  name: string;
  image: string;
  price: number;
  description: string;
  category: string;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true, enum: ['bulk', 'cut', 'items', 'supplements', 'accessories'] },
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
export default Product;