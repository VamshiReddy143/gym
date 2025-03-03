// app/api/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import dbConnect from "@/lib/mongodb";
import Cart from "@/models/Cart";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/authOptions";

interface ProductItem {
    _id: string;
    name: string;
    image: string;
    price: number;
    description: string;
    category: "bulk" | "cut" | "items" | "supplements" | "accessories";
    createdAt: Date;
    updatedAt: Date;
}

interface CartItem {
    product: ProductItem;
    quantity: number;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-01-27.acacia",
});

export async function POST(request: NextRequest) {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        const cart = await Cart.findOne({ user: session.user.id }).populate("items.product");
        if (!cart || cart.items.length === 0) {
            return NextResponse.json({ success: false, message: "Cart is empty" }, { status: 400 });
        }

        // Type the populated cart items
        const typedCartItems = cart.items as CartItem[];

        const sessionStripe = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: typedCartItems.map((item) => ({
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.product.name,
                    },
                    unit_amount: Math.round(item.product.price * 100),
                },
                quantity: item.quantity,
            })),
            mode: "payment",
            success_url: `${request.headers.get("origin")}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${request.headers.get("origin")}/cancel`,
            metadata: { userId: session.user.id },
        });

        const order = new Order({
            user: session.user.id,
            items: typedCartItems.map((item) => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.price,
            })),
            total: typedCartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
            stripeSessionId: sessionStripe.id,
        });
        await order.save();

        return NextResponse.json({ success: true, url: sessionStripe.url });
    } catch (error) {
        console.error("Checkout error:", error);
        return NextResponse.json({ success: false, message: "Failed to create checkout session" }, { status: 500 });
    }
}