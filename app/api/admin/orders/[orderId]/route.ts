import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/authOptions";



export async function PUT(req: NextRequest, context:{ params:Promise<{ orderId: string }> } ) {

  const params  = await context.params;
  
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
  
    if (!session || !session.user?.id || !session.user.isAdmin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
  
    const { status } = await req.json();
    const order = await Order.findById(params.orderId);
    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    order.status = status;
    await order.save();
    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ success: false, message: "Failed to update order" }, { status: 500 });
  }
}
