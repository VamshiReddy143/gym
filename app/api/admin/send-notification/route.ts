// app/api/admin/send-notification/route.ts
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import dbConnect from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/authOptions";
import axios from "axios";

const BREVO_API_KEY = process.env.BREVO_API_KEY || "";
const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || "default@example.com";

export async function POST(req: NextRequest) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    console.log("Session:", session);

    if (!session || !session.user) {
        return NextResponse.json({ success: false, message: "Unauthorized - No session" }, { status: 401 });
    }

    const isAdmin = session.user.isAdmin ?? false; // Safely check isAdmin with fallback
    if (!isAdmin) {
        return NextResponse.json({ success: false, message: "Unauthorized - Not an admin" }, { status: 403 });
    }

    // Extract adminId with type safety
    const adminId = session.user.id || session.user._id || session.user.sub;
    if (!adminId) {
        console.error("No valid admin ID found in session:", session.user);
        return NextResponse.json({ success: false, message: "Server error - No admin ID" }, { status: 500 });
    }

    const { message } = await req.json();
    if (!message || typeof message !== "string" || !message.trim()) {
        return NextResponse.json({ success: false, message: "Message is required" }, { status: 400 });
    }

    try {
        // Add notification to all users
        const notificationData = {
            message,
            sentBy: adminId,
            createdAt: new Date(),
        };
        await User.updateMany(
            {}, // All users
            { $push: { notifications: notificationData } }
        );

        // Fetch all users' emails
        const users = await User.find({}, "email").lean();
        const recipientEmails = users.map((user) => ({ email: user.email }));
        console.log("Emails to send:", recipientEmails);

        // Send email via Brevo API
        const response = await axios.post(
            "https://api.brevo.com/v3/smtp/email",
            {
                sender: { email: BREVO_SENDER_EMAIL, name: "Gym App Admin" },
                to: recipientEmails,
                subject: "New Notification from Gym App",
                textContent: message,
                htmlContent: `<p>${message}</p>`,
            },
            {
                headers: {
                    "accept": "application/json",
                    "api-key": BREVO_API_KEY,
                    "content-type": "application/json",
                },
            }
        );
        console.log("Email sent successfully via Brevo:", response.data);

        return NextResponse.json({ success: true, message: "Notification sent successfully" });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error sending notification:", error.message);
            return NextResponse.json({ success: false, message: "Server error: " + error.message }, { status: 500 });
        }
        console.error("Unknown error sending notification:", error);
        return NextResponse.json({ success: false, message: "Server error: Unknown error occurred" }, { status: 500 });
    }
}