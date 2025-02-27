import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Order from "@/models/Order";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/auth/authOptions";
import Product from "@/models/Product";
import mongoose, { Schema } from "mongoose";

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
    // const session = await getServerSession(authOptions);

    // if (!session || !session.user?.id || !session.user.isAdmin) {
    //     return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    // }

    try {
        // Fetch total users
        const totalUsers = await User.countDocuments();

        // Fetch all orders to calculate products sold and revenue
        const orders = await Order.find({ status: { $in: ["shipped", "delivered"] } }).populate("items.product");
        const productsSold = orders.reduce((sum: number, order: any) => {
            return sum + order.items.reduce((itemSum: number, item: any) => itemSum + item.quantity, 0);
        }, 0);
        const totalRevenue = orders.reduce((sum: number, order: any) => sum + order.total, 0);

        // Fetch all users with role and image
        const users = await User.find({}, "name email role image subscription").lean();
        console.log(users)

        return NextResponse.json({
            success: true,
            totalUsers,
            productsSold,
            totalRevenue,
            users,
        });
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return NextResponse.json({ success: false, message: "Failed to fetch dashboard data" }, { status: 500 });
    }
}