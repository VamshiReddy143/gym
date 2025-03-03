import {  NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Cart from "@/models/Cart";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/authOptions";

export async function GET() {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        const cart = await Cart.findOne({ user: session.user.id }).populate("items.product");
        if (!cart) {
            return NextResponse.json({ success: true, cart: { items: [] } });
        }
        return NextResponse.json({ success: true, cart });
    } catch (error) {
        console.error("Error fetching cart:", error);
        return NextResponse.json({ success: false, message: "Failed to fetch cart" }, { status: 500 });
    }
}