import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/authOptions";

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
    await dbConnect();

    // Get the session
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Extract userId from params (no need for `await` here)
    const { userId } = params;

    try {
        // Fetch the user from the database
        const user = await User.findById(userId).lean();
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        // Remove sensitive information
        delete user.password;

        // Return the user data
        return NextResponse.json({ success: true, user });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return NextResponse.json({ success: false, message: "Failed to fetch user profile" }, { status: 500 });
    }
}