import mongoose, { Schema, Document } from "mongoose";

export interface IChallenge extends Document {
    name: string;
    description: string;
    points: number; 
    date: Date;  
}

const ChallengeSchema = new Schema<IChallenge>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    points: { type: Number, required: true },
    date: { type: Date, required: true }
});

const Challenge = mongoose.models.Challenge || mongoose.model<IChallenge>("Challenge", ChallengeSchema);
export default Challenge;
