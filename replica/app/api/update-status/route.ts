import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // adjust import

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "orderId is required" },
        { status: 400 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "READY_TO_SHIP",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Order marked as READY_TO_SHIP",
        order: updatedOrder,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to update order status",
      },
      { status: 500 }
    );
  }
}
