import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/authOptions";

export async function GET(request: NextRequest, context:{ params:Promise<{ userId: string }> }) {
    const params  = await context.params;
    await dbConnect();

    // Get the session
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    
    const { userId } = params;

    try {
        // Fetch the user from the database
        const user = await User.findById(userId).lean();
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

      

        
        return NextResponse.json({ success: true, user });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return NextResponse.json({ success: false, message: "Failed to fetch user profile" }, { status: 500 });
    }
}