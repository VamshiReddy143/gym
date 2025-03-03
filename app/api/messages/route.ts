
import { NextRequest, NextResponse } from "next/server";
import Message from "@/models/Message";
import dbConnect from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const room = searchParams.get("room");

  if (!room) {
    return NextResponse.json({ success: false, error: "Room is required" }, { status: 400 });
  }

  await dbConnect();

  try {
    const messages = await Message.find({ room }).sort({ timestamp: 1 }).lean();
    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch messages" }, { status: 500 });
  }
}