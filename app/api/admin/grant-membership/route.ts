import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";
import dbConnect from "@/lib/mongodb";
import QRCode from "qrcode"; 

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const { userId } = await req.json();

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return NextResponse.json({ success: false, message: "Invalid user ID" }, { status: 400 });
        }

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        if (user.role === "admin") {
            return NextResponse.json({ success: false, message: "Cannot grant membership to an admin" }, { status: 403 });
        }

        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 6); // 6 months duration

        
        const qrCodeData = `Plan: Free Membership (Admin Granted), Start: ${startDate.toISOString()}, End: ${endDate.toISOString()}`;
        const qrCode = await QRCode.toDataURL(qrCodeData);

        const freeSubscription = {
            planName: "Free Membership (Admin Granted)",
            startDate,
            endDate,
            price: 0,
            qrCode, 
        };

        user.subscription = freeSubscription;
        await user.save();

        return NextResponse.json({
            success: true,
            message: "Free membership granted successfully",
            subscription: freeSubscription,
        });
    } catch (error) {
        console.error("Error granting membership:", error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}