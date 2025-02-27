import { NextRequest, NextResponse } from "next/server";
import mongoose, { Schema } from "mongoose";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/authOptions";

// Define Product schema inline
const ProductSchema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true, enum: ['bulk', 'cut', 'items', 'supplements', 'accessories'] },
}, { timestamps: true });

// Register Product model
mongoose.models.Product || mongoose.model("Product", ProductSchema);

export async function GET(request: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id || !session.user.isAdmin) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("Registered models:", mongoose.modelNames());
    const orders = await Order.find()
      .populate("items.product")
      .populate({
        path: "user",
        select: "name email"});
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch orders" }, { status: 500 });
  }
}