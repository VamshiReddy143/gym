import dbConnect from "@/lib/mongodb";
import Challenge from "@/models/Challenge";
import User from "@/models/User";
import { NextResponse } from "next/server";

const dailyChallenges = [
    { name: "Drink Water", description: "Drink 3L of water today", points: 5 },
    { name: "Walk 2 km", description: "Complete a 2 km walk", points: 10 },
    { name: "Meditate", description: "Meditate for 10 minutes", points: 8 },
    { name: "Eat Healthy", description: "Eat at least one healthy meal", points: 6 },
    { name: "Workout", description: "Complete a 30-minute workout", points: 12 }
];

export async function GET(req: Request) {
    await dbConnect();
    try {
        const userId = req.headers.get("userId");
        if (!userId) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const user = await User.findById(userId);
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
        // const lastChallengesDate = user.lastChallengesdate
        //     ? new Date(user.lastChallengesdate).toISOString().split("T")[0]
        //     : null;

        let challenges = await Challenge.find({ date: today }); 

        if (challenges.length === 0) {
            
            const selectedChallenges = dailyChallenges
                .sort(() => Math.random() - 0.5)
                .slice(0, 5)
                .map((challenge) => ({
                    ...challenge,
                    date: today
                }));

            challenges = await Challenge.insertMany(selectedChallenges);

            
            user.lastChallengesdate = new Date();
            user.completedChallenges = [];
            await user.save();
        }

        return NextResponse.json({ success: true, challenges });

    } catch (error) {
        console.error("Error fetching challenges:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}


