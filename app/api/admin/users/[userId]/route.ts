// ... (other imports and code remain the same)

import { authOptions } from "@/app/auth/authOptions";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(request: Request, context:{ params:Promise<{ userId: string }> }) {

    const params  = await context.params;
    await dbConnect();

    try {
        const { userId } =params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return NextResponse.json(
                { success: false, message: "Invalid user ID format" },
                { status: 400 }
            );
        }

        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        // Use isAdmin boolean instead of role string
        if (!session.user.isAdmin) {
            return NextResponse.json(
                { success: false, message: "Forbidden: Admin access required" },
                { status: 403 }
            );
        }

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        if (user.isAdmin) {
            return NextResponse.json(
                { success: false, message: "Cannot delete admin users" },
                { status: 403 }
            );
        }

        await User.findByIdAndDelete(userId);

        return NextResponse.json(
            { success: true, message: "User deleted successfully" },
            { status: 200 }
        );
    } catch (error: unknown) {
        console.error("Error deleting user:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}