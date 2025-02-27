import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import QRCode from "qrcode";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { userId, plan, price, startDate, endDate } = await req.json();

        const qrCodeData = `Plan: ${plan}, Start: ${startDate}, End: ${endDate}`;
        const qrCode = await QRCode.toDataURL(qrCodeData);

        await User.findByIdAndUpdate(userId, {
            subscription: {
                planName: plan, 
                price,
                startDate,
                endDate,
                qrCode,
            },
        }, { new: true });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Subscription update error:", error);
        return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 });
    }
}