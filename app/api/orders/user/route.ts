import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/authOptions";
import "@/models/Product";

export async function GET() {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        const orders = await Order.find({ user: session.user.id }).populate("items.product");
        return NextResponse.json({ success: true, orders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json({ success: false, message: "Failed to fetch orders" }, { status: 500 })
    }
}