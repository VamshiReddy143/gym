import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Cart from "@/models/Cart";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/authOptions";

export async function DELETE(request: NextRequest) {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        const cart = await Cart.findOne({ user: session.user.id });
        if (cart) {
            cart.items = [];
            await cart.save();
        }
        return NextResponse.json({ success: true, message: "Cart cleared" });
    } catch (error) {
        console.error("Error clearing cart:", error);
        return NextResponse.json({ success: false, message: "Failed to clear cart" }, { status: 500 });
    }
}