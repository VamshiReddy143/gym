import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Cart from "@/models/Cart";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/authOptions";

interface CartItem {
    product: string;
    quantity: number;   
}

export async function PUT(request: NextRequest) {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { productId, quantity } = await request.json();

    try {
        const cart = await Cart.findOne({ user: session.user.id });
        if (!cart) {
            return NextResponse.json({ success: false, message: "Cart not found" }, { status: 404 });
        }

        const itemIndex = cart.items.findIndex((item:CartItem) => item.product.toString() === productId);
        if (itemIndex > -1) {
            if (quantity <= 0) {
                cart.items.splice(itemIndex, 1);
            } else {
                cart.items[itemIndex].quantity = quantity;
            }
            await cart.save();
            await cart.populate("items.product");
            return NextResponse.json({ success: true, cart });
        } else {
            return NextResponse.json({ success: false, message: "Item not found in cart" }, { status: 404 });
        }
    } catch (error) {
        console.error("Error updating cart:", error);
        return NextResponse.json({ success: false, message: "Failed to update cart" }, { status: 500 });
    }
}