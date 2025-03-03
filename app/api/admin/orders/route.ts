// app/api/orders/user/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/authOptions";


export async function GET() {
    await dbConnect();



    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id || !session.user.isAdmin) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        const orders = await Order.find()
            .populate("items.product") // Rely on ref: "Product" in Order schema
            .populate({ path: "user", select: "name email" });

        return NextResponse.json({ success: true, orders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json({ success: false, message: "Failed to fetch orders" }, { status: 500 });
    }
}