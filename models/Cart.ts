import mongoose, { Schema, Document } from "mongoose";

interface ICartItem {
    product: Schema.Types.ObjectId;
    quantity: number;
}

interface ICart extends Document {
    user: Schema.Types.ObjectId;
    items: ICartItem[];
}

const CartItemSchema = new Schema<ICartItem>({
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
});

const CartSchema = new Schema<ICart>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
        items: [CartItemSchema],
    },
    { timestamps: true }
);

const Cart = mongoose.models.Cart || mongoose.model<ICart>("Cart", CartSchema);

export default Cart;