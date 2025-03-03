// app/api/users/leaderboard/route.ts
import {  NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  await dbConnect();

  try {
    const users = await User.find({}, "name image points streak awards").lean();
    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch leaderboard" }, { status: 500 });
  }
}