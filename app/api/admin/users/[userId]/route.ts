import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function DELETE(request: Request, { params }: { params: { userId: string } }) {
    await dbConnect();
    try {
        const { userId } = params;
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        await User.findByIdAndDelete(userId);
        
        return NextResponse.json({ success: true, message: "User deleted" });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, message: "Failed to delete user" }, { status: 500 });
    }
}   