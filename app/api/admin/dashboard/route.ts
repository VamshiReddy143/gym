import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Order from "@/models/Order";


// import mongoose, { Schema } from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/authOptions";
import "@/models/Product";

// const ProductSchema = new Schema({
//     name: { type: String, required: true },
//     image: { type: String, required: true },
//     price: { type: Number, required: true },
//     description: { type: String, required: true },
//     category: { type: String, required: true, enum: ['bulk', 'cut', 'items', 'supplements', 'accessories'] },
//   }, { timestamps: true });
  
//   const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
//   export default Product;
  


  interface Product {
    _id: string;
    name: string;
    image: string;
    price: number;
    description: string;
    category: "bulk" | "cut" | "items" | "supplements" | "accessories";
}

// Define the OrderItem interface (for populated items in Order)
interface OrderItem {
    product: Product;
    quantity: number;
}

// Define the Order interface
interface OrderType {
    _id: string;
    items: OrderItem[];
    total: number;
    status: string;
}




export async function GET() {
    await dbConnect();
    // const session = await getServerSession(authOptions);

   const session = await getServerSession(authOptions);
    if (!session || !session.user?.id || !session.user.isAdmin) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 200 });
    }
    try {
        // Fetch total users
        const totalUsers = await User.countDocuments();
        

        // Fetch all orders to calculate products sold and revenue
        const orders = await Order.find({ status: { $in: ["shipped", "delivered"] } }).populate({
            path: "items.product",
            model: "Product",
        });
        const productsSold = orders.reduce((sum: number, order: OrderType) => {
            return sum + order.items.reduce((itemSum: number, item: OrderItem) => itemSum + item.quantity, 0);
        }, 0);
        const totalRevenue = orders.reduce((sum: number, order: OrderType) => sum + order.total, 0);

        // Fetch all users with role and image
        const users = await User.find({}, "name email role image subscription").lean();
       

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