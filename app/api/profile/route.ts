import { authOptions } from "@/app/auth/authOptions";
import dbConnect from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";



export async function GET() {
    try {
        await dbConnect();

        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }



        let userId: string | mongoose.Types.ObjectId = session.user?.id;



        if (!mongoose.Types.ObjectId.isValid(userId)) {
            const existingUser = await User.findOne({ email: session.user?.email }).select("_id");
            if (!existingUser) {
                return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
            }
            userId = existingUser._id;
        } else {
            userId = new mongoose.Types.ObjectId(userId);
        }

        const user = await User.findById(userId);


        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            user: {
                name: user.name,
                email: user.email,
                image: user.image,
                phonenumber: user.phonenumber,
                Address: user.Address,
                gender: user.gender,
                subscription: user.subscription,
                streak: user.streak,
                points: user.points,       
                awards:user.awards,
                createdAt: user.createdAt,
                completedChallenges:user.completedChallenges
            },
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}






export async function PUT(request: NextRequest) {
    try {
        await dbConnect();

        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        // Get userId from session
        let userId: string | mongoose.Types.ObjectId = session.user?.id;

        // Validate and convert userId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            const existingUser = await User.findOne({ email: session.user?.email }).select("_id");
            if (!existingUser) {
                return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
            }
            userId = existingUser._id;
        } else {
            userId = new mongoose.Types.ObjectId(userId);
        }

        // Get the update data from request body
        const body = await request.json();
        console.log("Received body:", body);
        const { name, location, gender, email, phonenumber, image } = body;

        // Prepare update object with only provided fields
        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (location !== undefined) updateData.Address = location; // Note: Changing 'location' to 'Address' to match your GET route
        if (gender !== undefined) updateData.gender = gender;
        if (email !== undefined) updateData.email = email;
        if (phonenumber !== undefined) updateData.phonenumber = phonenumber;
        if (image !== undefined) updateData.image = image;


        console.log("Update data:", updateData);
        // Update user in MongoDB
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        console.log("Updated user:", updatedUser);

        if (!updatedUser) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ 
            success: true,
            user: {
                name: updatedUser.name,
                email: updatedUser.email,
                image: updatedUser.image,
                phonenumber: updatedUser.phonenumber,
                Address: updatedUser.Address,
                gender: updatedUser.gender
            }
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json({ 
            success: false, 
            message: "Failed to update profile",
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
