// app/api/notifications/route.ts
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import dbConnect from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/authOptions";

export async function GET(req: NextRequest) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id || (session.user as any)._id || session.user.sub;
    if (!userId) {
        return NextResponse.json({ success: false, message: "No user ID found" }, { status: 400 });
    }

    try {
        const user = await User.findById(userId, "notifications").lean();
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, notifications: user.notifications || [] });
    } catch (error: any) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}