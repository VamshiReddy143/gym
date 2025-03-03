// models/Message.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const MessageSchema = new Schema({
  room: { type: String, required: true },
  userId: { type: String },
  userName: { type: String, required: true },
  userImage: { type: String}, 
  text: { type: String, default: "" },
  image: { type: String,default:null },
  voice: { type: String },
  reactions: { type: Map, of: [String], default: {} },
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.models.Message || mongoose.model("Message", MessageSchema);

export default Message;