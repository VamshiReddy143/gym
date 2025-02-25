
import dbConnect from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe =new Stripe(process.env.STRIPE_SECRET_KEY as string,{
    apiVersion:"2025-01-27.acacia"
})

export async function POST(req:Request){
    try {
        await dbConnect()
        const {userId,plan,price,duration} = await req.json()

        const startDate = new Date()
        const endDate = new Date()
        endDate.setDate(startDate.getDate() + duration)

        const session =await stripe.checkout.sessions.create({
            payment_method_types:["card"],
            line_items:[{
                price_data:{
                    currency:"usd",
                    product_data:{name:plan},
                    unit_amount:price*100,
                },
                quantity:1
            }],
            mode:"payment",
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/billing/success?userId=${userId}&plan=${plan}&price=${price}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`,
            cancel_url:`${process.env.NEXT_PUBLIC_URL}/cancel`
        })
        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error("Stripe Checkout Error:", error);
        return NextResponse.json({ error: "Payment failed" }, { status: 500 });
    }
}