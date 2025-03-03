// app/api/notifications/delete/route.ts
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import dbConnect from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/authOptions";

export async function DELETE(req: NextRequest) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Extract userId with type safety using extended next-auth types
    const userId = session.user.id || session.user._id || session.user.sub;
    if (!userId) {
        return NextResponse.json({ success: false, message: "No user ID found" }, { status: 400 });
    }

    try {
        const { id } = await req.json();
        if (!id || typeof id !== "string") {
            return NextResponse.json({ success: false, message: "Invalid notification ID" }, { status: 400 });
        }

        const result = await User.updateOne(
            { _id: userId },
            { $pull: { notifications: { _id: id } } }
        );

        if (result.modifiedCount === 0) {
            return NextResponse.json({ success: false, message: "Notification not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Notification deleted successfully" });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error deleting notification:", error.message);
            return NextResponse.json({ success: false, message: "Server error: " + error.message }, { status: 500 });
        }
        console.error("Unknown error deleting notification:", error);
        return NextResponse.json({ success: false, message: "Server error: Unknown error occurred" }, { status: 500 });
    }
}