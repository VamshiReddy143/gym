import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Cart from "@/models/Cart";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/authOptions";

export async function POST(request: NextRequest) {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { productId, quantity } = await request.json();

    try {
        let cart = await Cart.findOne({ user: session.user.id });
        if (!cart) {
            cart = new Cart({ user: session.user.id, items: [] });
        }

        const existingItemIndex = cart.items.findIndex((item: any) => item.product.toString() === productId);
        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        await cart.save();
        await cart.populate("items.product");
        return NextResponse.json({ success: true, cart });
    } catch (error) {
        console.error("Error adding to cart:", error);
        return NextResponse.json({ success: false, message: "Failed to add to cart" }, { status: 500 });
    }
}