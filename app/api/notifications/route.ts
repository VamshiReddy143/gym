import { NextResponse } from "next/server";
import User from "@/models/User";
import dbConnect from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/authOptions";

// Define the SessionUser interface
interface SessionUser {
    id?: string;
    _id?: string;
    isAdmin?: boolean;
    name?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
    sub?: string;
}

// Define the Notification interface (singular, renamed for clarity)
interface Notification {
    message: string;
    createdAt: Date;
    sentBy: string;
}

// Define the User interface for the lean result
interface UserType {
    _id: string;
    notifications?: Notification[]; // Array of Notification objects, optional
}

export async function GET() {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Extract user ID with proper typing
    const userId = session.user.id || (session.user as SessionUser)._id || (session.user as SessionUser).sub;
    if (!userId) {
        return NextResponse.json({ success: false, message: "No user ID found" }, { status: 400 });
    }

    try {
        // Fetch user with notifications field, typed with lean()
        const user = await User.findById(userId, "notifications").lean() as UserType | null;
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        // Return typed response
        return NextResponse.json({
            success: true,
            notifications: user.notifications || [],
        });
    } catch (error: unknown) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}