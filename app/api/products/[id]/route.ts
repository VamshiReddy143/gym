import { NextResponse } from "next/server";

import Product from "@/models/Product";
import dbConnect from "@/lib/mongodb";


export async function DELETE(req: Request, context:{ params:Promise<{ id: string }> }) {
  
  const params  = await context.params;
  await dbConnect();
  
  try {
    const deletedProduct = await Product.findByIdAndDelete(params.id);
    if (!deletedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Error deleting product" }, { status: 500 });
  }
}
