import { NextResponse } from "next/server";
import Challenge from "@/models/Challenge";
import User from "@/models/User";
import dbConnect from "@/lib/mongodb";

const AWARD_THRESHOLDS = [
    { streak: 1, award: "/newbie.png" },
    { streak: 5, award: "/bronze1.png" },
    { streak: 20, award: "/silver1.png" },
    { streak: 50, award: "/gold1.png" },
   
];

export async function POST(req: Request) {
    await dbConnect();

    try {
        const body = await req.json();
        const { userId, challengeId } = body;

        if (!userId || !challengeId) {
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
        }

        const user = await User.findById(userId);
        const challenge = await Challenge.findById(challengeId);
        
        if (!user || !challenge) {
            return NextResponse.json({ error: "User or challenge not found" }, { status: 404 });
        }

        if (user.completedChallenges.includes(challengeId)) {
            return NextResponse.json({ error: "Challenge already completed" }, { status: 400 });
        }

        user.completedChallenges.push(challengeId);
        user.points += challenge.points;

       

        if (user.completedChallenges.length >= 5) {
            user.streak += 1;
          

            if (!Array.isArray(user.awards)) {
                user.awards = [];
            }

           
            const unlockedAwards = AWARD_THRESHOLDS
                .filter(a => a.streak <= user.streak) 
                .map(a => a.award);

            user.awards = [...new Set([...user.awards, ...unlockedAwards])];
        }

        await user.save();
        return NextResponse.json({ success: true, user });
    } catch (error) {
        return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 });
    }
}
