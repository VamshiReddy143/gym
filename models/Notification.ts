
import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
    message: string;
    createdAt: Date;
    sentBy: string; 
}

const NotificationSchema = new Schema<INotification>({
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    sentBy: { type: String, required: true },
});

const Notification = mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema);

export default Notification;