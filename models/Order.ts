// models/Order.ts
import mongoose, { Schema, Document } from "mongoose";

interface IOrderItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  total: number;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  stripeSessionId?: string;
  shippingAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
});

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [OrderItemSchema],
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    stripeSessionId: { type: String },
    shippingAddress: { type: String },
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;