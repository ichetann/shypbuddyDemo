
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(50, Number(searchParams.get("limit")) || 3);

  const skip = (page - 1) * limit;

  console.log(page,limit);
  
  const [users, total] = await Promise.all([
    prisma.order.findMany({
      skip,
      take: limit,
      
      orderBy: {
        createdAt: "asc",
      },
      include: {
        buyer: true,
        pickupAddress: true,
        rtoAddress: true,
        package: true,
        productOrders: {
          include: { product: true },
        },
      },
    }),
    prisma.order.count(),
  ]);

  return NextResponse.json({
    data: users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
